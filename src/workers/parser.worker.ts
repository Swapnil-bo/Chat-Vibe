/* Web Worker for parsing WhatsApp chat logs.
   Offloads the heavy regex processing from the main thread.
*/

self.onmessage = (e: MessageEvent<string>) => {
    const fileContent = e.data;
    const messages = parseWhatsAppChat(fileContent);

    // Send result back to main thread
    self.postMessage(messages);
};

export interface ChatMessage {
    date: Date;
    author: string;
    message: string;
}

function parseWhatsAppChat(text: string): ChatMessage[] {
    const lines = text.split('\n');
    const messages: ChatMessage[] = [];

    // iOS format:
    // [15/08/23, 10:45:12 PM] Author: Message
    const iosRegex =
        /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}:\d{2}\s[AP]M)\]\s(.*?):\s(.*)/;

    // Android format (12h or 24h):
    // 15/08/23, 10:45 PM - Author: Message
    // 15/08/23, 23:07 - Author: Message
    const androidRegex =
        /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s[AP]M)?\s-\s(.*?):\s(.*)/;

    let currentMessage: ChatMessage | null = null;

    for (const line of lines) {
        const match = line.match(iosRegex) || line.match(androidRegex);

        if (match) {
            // Push previous message
            if (currentMessage) {
                messages.push(currentMessage);
            }

            const dateStr = match[1];
            const timeStr = match[2];
            const author = match[3];
            const content = match[4];

            // ---- Safe date parsing ----
            const [day, month, yearRaw] = dateStr.split('/');
            const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;

            const [hourStr, minuteStr] = timeStr.split(':');
            const hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);

            const dateTime = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                hour,
                minute
            );

            currentMessage = {
                date: dateTime,
                author,
                message: content,
            };
        } else {
            // Continuation of previous message
            if (currentMessage) {
                currentMessage.message += `\n${line}`;
            }
        }
    }

    // Push last message
    if (currentMessage) {
        messages.push(currentMessage);
    }

    return messages;
}

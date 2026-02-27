// src/workers/parser.worker.ts

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
    // 1. Scrub invisible Unicode 'L-R marks'
    const cleanText = text.replace(/[\u200E\u200F\u202A-\u202E]/g, '');
    const lines = cleanText.split('\n');
    const messages: ChatMessage[] = [];

    // 2. Updated Regex: More flexible with separators, seconds, and AM/PM casing
    const iosRegex = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[aApP]\.?[mM]\.?)?)\]\s(.*?):\s(.*)/;
    const androidRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[aApP]\.?[mM]\.?)?)\s-\s(.*?):\s(.*)/;

    let currentMessage: ChatMessage | null = null;

    for (const line of lines) {
        if (!line.trim()) continue;

        const match = line.match(iosRegex) || line.match(androidRegex);

        if (match) {
            if (currentMessage) messages.push(currentMessage);

            const dateStr = match[1];
            const timeStr = match[2];
            const author = match[3];
            const content = match[4];

            // 3. Initialize variables explicitly as strings to make TypeScript happy
            const dateParts = dateStr.split(/[./-]/);
            let day = "01", month = "01", year = "2000";

            if (dateParts.length >= 3) {
                if (dateParts[0].length === 4) {
                    year = dateParts[0]; month = dateParts[1]; day = dateParts[2];
                } else if (parseInt(dateParts[0]) > 12) {
                    day = dateParts[0]; month = dateParts[1]; year = dateParts[2];
                } else {
                    month = dateParts[0]; day = dateParts[1]; year = dateParts[2];
                }
            }

            const fullYear = year.length === 2 ? `20${year}` : year;
            const parsedDate = new Date(`${fullYear}-${month}-${day} ${timeStr.replace(/\./g, '')}`);

            currentMessage = {
                date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
                author: author.trim(),
                message: content.trim(),
            };
        } else if (currentMessage) {
            // Fixed: Using backticks (`) instead of single quotes (')
            currentMessage.message += `\n${line.trim()}`;
        }
    }

    if (currentMessage) messages.push(currentMessage);
    return messages;
}
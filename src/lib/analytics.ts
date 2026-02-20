import { ChatMessage } from '../workers/parser.worker';
import { format } from 'date-fns';

export const analyzeChat = (messages: ChatMessage[]) => {
  if (!messages.length) return null;

  // 1. Identify Participants
  const authors = Array.from(new Set(messages.map(m => m.author)));
  const stats: Record<string, { count: number; doubleTexts: number }> = {};
  
  authors.forEach(a => stats[a] = { count: 0, doubleTexts: 0 });

  // 2. Timeline Data (Messages per Day)
  const timelineMap: Record<string, number> = {};
  
  let lastAuthor = '';
  
  messages.forEach((msg) => {
    // Count messages
    if (stats[msg.author]) {
      stats[msg.author].count++;
    }

    // Check for Double Texts
    if (msg.author === lastAuthor) {
      stats[msg.author].doubleTexts++;
    }
    lastAuthor = msg.author;

    // Timeline Aggregation
    const dateKey = format(new Date(msg.date), 'yyyy-MM-dd');
    timelineMap[dateKey] = (timelineMap[dateKey] || 0) + 1;
  });

  // Convert map to array for charts
  const timelineData = Object.entries(timelineMap).map(([date, count]) => ({
    date,
    count,
  }));

  return { authors, stats, timelineData };
};

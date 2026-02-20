'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateVibeCheck(chatSample: string) {
  const result = await generateObject({
    model: google('models/gemini-2.5-flash'),
    schema: z.object({
      roast: z.string().describe('A 1-sentence savage roast of the relationship dynamic.'),
      simpLevel: z.number().min(0).max(100).describe('Percentage of "simp" energy detected.'),
      interestedParty: z.string().describe('The name of the person who is clearly more interested.'),
      redFlags: z.array(z.string()).describe('List of 3 subtle red flags found in the text.'),
    }),
    prompt: `
Analyze this WhatsApp chat segment strictly for psychological dynamics. 
Be witty, observant, and slightly savage (Gen Z style).

CHAT LOG:
${chatSample}
    `,
  });

  return result.object;
}

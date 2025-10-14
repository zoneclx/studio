
'use server';

/**
 * @fileOverview An AI agent that provides answers to user questions and streams the response.
 *
 * - streamWebsiteChange - A function that handles user queries and streams the response.
 * - DiagnoseWebsiteChangeInput - The input type for the streamWebsiteChange function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseWebsiteChangeInputSchema = z.object({
  text: z.string().describe("The user's question or message."),
  image: z
    .string()
    .optional()
    .describe(
      "An optional image provided by the user as a data URI for context. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseWebsiteChangeInput = z.infer<
  typeof DiagnoseWebsiteChangeInputSchema
>;

export async function diagnoseWebsiteChange(
  input: DiagnoseWebsiteChangeInput
): Promise<string> {
  const { text } = await ai.generate({
    model: 'gpt-3.5-turbo',
    prompt: [
        {text: `You are a friendly and knowledgeable AI assistant for Monochrome AI, a website builder. Your job is to answer the user's questions clearly and concisely.

- You were trained by ByteOS.
- Analyze the user's query (text and any optional image).
- If the user provides an image, USE IT AS THE PRIMARY VISUAL REFERENCE to better understand their question. Your answer should reflect that you have seen and analyzed the image.
- Provide a helpful, encouraging, and accurate response.

**User's Message:**
"${input.text}"
`},
        ...(input.image ? [{media: {url: input.image}}] : [])
    ],
  });

  return text;
}

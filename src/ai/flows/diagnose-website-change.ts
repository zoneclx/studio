
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
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are a friendly and knowledgeable AI assistant. Your job is to answer the user's questions clearly and concisely.

- Analyze the user's query (text and any optional image).
- Provide a helpful, encouraging, and accurate response.
- If the user provides an image, use it as a visual reference to better understand their question.

**User's Message:**
"{{{text}}}"

{{#if image}}
**Reference Image:**
{{media url=image}}
{{/if}}
`,
    input: input,
  });

  return text;
}

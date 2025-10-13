'use server';

/**
 * @fileOverview An AI agent that provides answers to user questions.
 *
 * - diagnoseWebsiteChange - A function that handles user queries with text and optional images.
 * - DiagnoseWebsiteChangeInput - The input type for the diagnoseWebsiteChange function.
 * - DiagnoseWebsiteChangeOutput - The return type for the diagnoseWebsiteChange function.
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

const DiagnoseWebsiteChangeOutputSchema = z.object({
  response: z.string().describe("The AI's helpful and informative response to the user's query."),
});
export type DiagnoseWebsiteChangeOutput = z.infer<
  typeof DiagnoseWebsiteChangeOutputSchema
>;

export async function diagnoseWebsiteChange(
  input: DiagnoseWebsiteChangeInput
): Promise<DiagnoseWebsiteChangeOutput> {
  return diagnoseWebsiteChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseWebsiteChangePrompt',
  input: { schema: DiagnoseWebsiteChangeInputSchema },
  output: { schema: DiagnoseWebsiteChangeOutputSchema },
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
});

const diagnoseWebsiteChangeFlow = ai.defineFlow(
  {
    name: 'diagnoseWebsiteChangeFlow',
    inputSchema: DiagnoseWebsiteChangeInputSchema,
    outputSchema: DiagnoseWebsiteChangeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

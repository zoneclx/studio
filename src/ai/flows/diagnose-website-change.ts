'use server';

/**
 * @fileOverview An AI agent that provides feedback on website change requests.
 *
 * - diagnoseWebsiteChange - A function that handles website change requests with text and optional images.
 * - DiagnoseWebsiteChangeInput - The input type for the diagnoseWebsiteChange function.
 * - DiagnoseWebsiteChangeOutput - The return type for the diagnoseWebsiteChange function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseWebsiteChangeInputSchema = z.object({
  text: z.string().describe('The user\'s request for a change to their website.'),
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
  response: z.string().describe('The AI\'s response to the user\'s request.'),
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
  prompt: `You are an expert web developer and UI/UX designer who also functions as a helpful AI assistant. A user is asking for help or ideas related to building a website.

Your task is to analyze their request (text and any optional image) and provide a helpful, encouraging, and actionable response.

- If the user provides an image, use it as a primary visual reference.
- If the user is asking for ideas, provide creative and relevant suggestions.
- If the user is describing a problem, offer solutions or alternative approaches.
- If they are asking for changes, suggest a more detailed prompt they could use to get a better result from the website builder.

**User Request:**
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

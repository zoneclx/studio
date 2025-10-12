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
  prompt: `You are an expert web developer and UI/UX designer. A user is asking for changes to a website they are building.
  
Your task is to provide helpful feedback, suggestions, and updated prompt text based on their request.

If the user provides an image, use it as a visual reference for their request.

**User Request:**
"{{{text}}}"

{{#if image}}
**Reference Image:**
{{media url=image}}
{{/if}}

Based on the user's request, provide a helpful and encouraging response. If you can, suggest a more detailed prompt they could use to get a better result.
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

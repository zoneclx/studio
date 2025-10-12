'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 * - CreateWebsiteFromPromptInput - The input type for the createWebsiteFromPrompt function.
 * - CreateWebsiteFromPromptOutput - The return type for the createWebsiteFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

const CreateWebsiteFromPromptOutputSchema = z.object({
  websiteHtml: z.string().describe('The generated HTML code for the website, including Tailwind CSS.'),
});
export type CreateWebsiteFromPromptOutput = z.infer<
  typeof CreateWebsiteFromPromptOutputSchema
>;

export async function createWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): Promise<CreateWebsiteFromPromptOutput> {
  return createWebsiteFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createWebsiteFromPromptPrompt',
  input: {schema: CreateWebsiteFromPromptInputSchema},
  output: {schema: CreateWebsiteFromPromptOutputSchema},
  prompt: `You are an expert web developer. A user wants to create a website.
  
Generate a single, self-contained HTML file for a visually appealing website based on the user's prompt.

**Requirements:**
1.  **Frameworks:** Use HTML and Tailwind CSS for styling.
2.  **Tailwind CSS:** Include Tailwind CSS via the official CDN script tag in the \`<head>\` section.
    \`<script src="https://cdn.tailwindcss.com"></script>\`
3.  **Content:** The content of the website should be directly related to the user's prompt.
4.  **Completeness:** The output must be a complete HTML document, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`.
5.  **Placeholders:** Use placeholder images from 'https://picsum.photos/' where appropriate (e.g., \`https://picsum.photos/seed/1/800/600\`).

**User Prompt:**
"{{prompt}}"
`,
});

const createWebsiteFromPromptFlow = ai.defineFlow(
  {
    name: 'createWebsiteFromPromptFlow',
    inputSchema: CreateWebsiteFromPromptInputSchema,
    outputSchema: CreateWebsiteFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

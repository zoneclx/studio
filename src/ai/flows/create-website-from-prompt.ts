'use server';

/**
 * @fileOverview A website generation AI agent that streams its output.
 *
 * - streamWebsiteFromPrompt - A function that generates HTML for a website based on a prompt and streams the output.
 * - CreateWebsiteFromPromptInput - The input type for the streamWebsiteFromPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

// This flow now returns an AsyncGenerator that yields string chunks.
export async function* streamWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): AsyncGenerator<string> {
  const { stream } = await ai.generate({
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
"{{{prompt}}}"
`,
    model: 'googleai/gemini-2.5-flash',
    stream: true,
    config: {
      temperature: 0.7,
    },
    input: {
        prompt: input.prompt
    }
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

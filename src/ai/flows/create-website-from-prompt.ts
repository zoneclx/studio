
'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 */
import { ai } from '@/ai/genkit';
import { CreateWebsiteFromPromptInputSchema, WebsiteCodeSchema, type CreateWebsiteFromPromptInput, type WebsiteCode } from '@/ai/schemas';

export async function createWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): Promise<WebsiteCode> {
    return createWebsiteFromPromptFlow(input);
}


const createWebsiteFromPromptFlow = ai.defineFlow(
  {
    name: 'createWebsiteFromPromptFlow',
    inputSchema: CreateWebsiteFromPromptInputSchema,
    outputSchema: WebsiteCodeSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'gemini-pro',
        prompt: `You are an expert web developer creating a single-page website.
        
        Prompt: "${input.prompt}"
        
        Generate the complete HTML for the page.
        - The response MUST be a single, complete HTML document.
        - Include the DOCTYPE, head, and body.
        - Inline all CSS within a <style> tag in the <head>.
        - Use Tailwind CSS for styling. You must include the Tailwind CDN script: <script src="https://cdn.tailwindcss.com"></script>.
        - Inline all JavaScript within a <script> tag at the end of the <body>.

        Your response must be a valid JSON object with a single key, "html", containing the full HTML code as a string.
        
        Example: { "html": "<!DOCTYPE html>..." }
        `,
        config: {
            temperature: 0.8,
        },
        output: {
          schema: WebsiteCodeSchema,
        }
    });

    if (!output) {
      throw new Error('AI response did not contain a valid output.');
    }

    return output;
  }
);


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
        model: 'gpt-4o',
        prompt: `You are an expert web developer. Create a complete, single-page website based on the following prompt.

        Prompt: "${input.prompt}"
        
        Your response must be a valid JSON object matching this schema: { "html": "...", "css": "", "javascript": "" }.
        
        Inside the 'html' property, provide the raw HTML code for a complete, valid, and modern-looking webpage.
        - The HTML must include the DOCTYPE declaration, head, and body.
        - All CSS must be included directly inside a <style> tag in the <head>. You must include the full Tailwind CSS library via this CDN script in the head: <script src="https://cdn.tailwindcss.com"></script>. Use Tailwind CSS classes for styling.
        - All JavaScript for interactivity must be included directly inside a <script> tag at the end of the <body>.
        
        The 'css' and 'javascript' properties in the JSON object should be empty strings, as all styling and scripts must be inlined in the HTML.
        `,
        output: {
            schema: WebsiteCodeSchema,
        },
    });

    if (!output) {
      throw new Error('AI failed to generate a valid website structure.');
    }
    
    return output;
  }
);


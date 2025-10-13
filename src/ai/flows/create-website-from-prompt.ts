
'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 */

import { ai } from '@/ai/genkit';
import { CreateWebsiteFromPromptInput, WebsiteCode, CreateWebsiteFromPromptInputSchema, WebsiteCodeSchema } from '@/ai/schemas';

export async function createWebsiteFromPrompt(input: CreateWebsiteFromPromptInput): Promise<WebsiteCode> {
  const { prompt } = input;

  const { output } = await ai.generate({
    prompt: `You are an expert web developer. Create a complete, single-page website based on the following prompt.
    
    Prompt: "${prompt}"
    
    Your response must be a valid JSON object with three keys: "html", "css", and "javascript".
    
    - The "html" key should contain the full HTML structure. It must include a DOCTYPE declaration, head, and body. It should link to "style.css" and "script.js". Ensure the HTML is well-structured and semantic. Use Tailwind CSS classes for styling directly in the HTML.
    - The "css" key should contain any additional CSS. If all styling is done with Tailwind in the HTML, this can be an empty string. Do not include CSS that is already handled by Tailwind.
    - The "javascript" key should contain any necessary JavaScript for interactivity. If no JavaScript is needed, this can be an empty string. Do not include the <script> tags.`,
    model: 'googleai/gemini-1.5-flash-latest',
    output: {
      schema: WebsiteCodeSchema,
      format: 'json',
    },
    config: {
      responseMimeType: 'application/json',
    },
  });

  if (!output) {
    throw new Error('AI failed to generate a response.');
  }

  return output;
}

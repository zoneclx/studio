
'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 */
import { ai } from '@/ai/genkit';
import { CreateWebsiteFromPromptInput, WebsiteCodeSchema, type WebsiteCode } from '@/ai/schemas';

export async function createWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): Promise<WebsiteCode> {
  const { text } = await ai.generate({
    prompt: `You are an expert web developer. Create a complete, single-page website based on the following prompt.

    Prompt: "${input.prompt}"
    
    Your response must be ONLY the raw HTML code for a complete, valid, and modern-looking webpage.
    - Include the DOCTYPE declaration, head, and body.
    - All CSS must be included directly inside a <style> tag in the <head>.
    - All JavaScript for interactivity must be included directly inside a <script> tag at the end of the <body>.
    - Use Tailwind CSS classes for styling where possible, but embed the full Tailwind library or use a CDN link so the classes work. A good option is: <script src="https://cdn.tailwindcss.com"></script>
    
    Return ONLY the HTML code and nothing else. Do not wrap it in markdown or any other characters.`,
  });

  if (!text) {
    throw new Error('AI failed to generate a response.');
  }

  // The output is now just the raw HTML string.
  return WebsiteCodeSchema.parse({ html: text, css: '', javascript: ''});
}

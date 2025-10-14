
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
    const { text } = await ai.generate({
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
    });

    try {
        // Clean the raw text response to make it valid JSON
        let cleanedText = text;
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
        }
        
        const parsedOutput = JSON.parse(cleanedText);
        
        if (!parsedOutput.html) {
            throw new Error('AI response did not contain an "html" property.');
        }

        return {
            html: parsedOutput.html,
        };

    } catch (e) {
        console.error("Failed to parse AI response:", e);
        // If parsing fails, wrap the raw text in a basic HTML structure as a fallback.
        return {
            html: `<!DOCTYPE html><html><head><title>AI Fallback</title><script src="https://cdn.tailwindcss.com"></script></head><body><div class="p-4 text-red-500">Error parsing AI response. Raw output below:</div><pre class="p-4 bg-gray-100 rounded">${text}</pre></body></html>`,
        };
    }
  }
);

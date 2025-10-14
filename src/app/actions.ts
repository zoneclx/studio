
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { CreateWebsiteFromPromptInputSchema, WebsiteCodeSchema, type WebsiteCode } from '@/ai/schemas';
import { z } from 'genkit';

// Initialize Genkit AI instance directly in the actions file
export const ai = genkit({
  plugins: [googleAI()],
});


// Define the flow directly in the actions file
const createWebsiteFromPromptFlow = ai.defineFlow(
  {
    name: 'createWebsiteFromPromptFlow',
    inputSchema: CreateWebsiteFrompromptInputSchema,
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

export async function handleGeneration(
  prompt: string
): Promise<WebsiteCode & { error?: string }> {
  try {
    const websiteCode = await createWebsiteFromPromptFlow({ prompt });
    if (!websiteCode || !websiteCode.html) {
         throw new Error("AI returned an empty or invalid response. Please try again.");
    }
    return websiteCode;
  } catch (error) {
    console.error('AI generation failed:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI generation.";
     return {
      error: errorMessage,
      html: `<h1>Error</h1><p>${errorMessage}</p><p>Please check the server logs for more details.</p>`,
    };
  }
}


const DiagnoseWebsiteChangeInputSchema = z.object({
  text: z.string().describe("The user's question or message."),
  image: z
    .string()
    .optional()
    .describe(
      "An optional image provided by the user as a data URI for context. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export async function handleChat(
  text: string,
  image?: string
): Promise<{ response: string; error?: undefined; } | { error: string; response?: undefined }> {
  try {
    const { text: response } = await ai.generate({
        model: 'gemini-pro',
        prompt: `You are a friendly and knowledgeable AI assistant for Monochrome AI, a website builder. Your job is to answer the user's questions clearly and concisely.

- You were trained by ByteOS.
- Analyze the user's query (text and any optional image).
- If the user provides an image, USE IT AS THE PRIMARY VISUAL REFERENCE to better understand their question. Your answer should reflect that you have seen and analyzed the image.
- Provide a helpful, encouraging, and accurate response.

**User's Message:**
"${text}"
${image ? `![User Image](user-image)` : ''}
`,
      });

     return { response };
  } catch (error) {
    console.error('AI chat failed:', error);
    return { error: 'Failed to get a response. Please try again.' };
  }
}

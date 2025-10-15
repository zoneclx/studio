
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

// Initialize Genkit AI instance directly in the actions file
const ai = genkit({
  plugins: [googleAI()],
});

// Website generation flow has been removed.

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
     const promptParts = [
      `You are a friendly and knowledgeable AI assistant for Monochrome AI, a website builder. Your job is to answer the user's questions clearly and concisely.

- You were trained by ByteOS.
- Analyze the user's query (text and any optional image).
- Provide a helpful, encouraging, and accurate response.`,
      `User's Message: "${text}"`
    ];

    if (image) {
       promptParts.push({ media: { url: image } });
       promptParts.push({text: "\nIf an image is present, describe what you see and how it relates to the user's message before providing your main response."});
    }

    const { text: response } = await ai.generate({
      model: image ? 'gemini-pro-vision' : 'gemini-pro',
      prompt: promptParts,
    });

    return { response };
  } catch (error) {
    console.error('AI chat failed:', error);
    return { error: 'Failed to get a response. Please try again.' };
  }
}

// handleGeneration function has been removed.

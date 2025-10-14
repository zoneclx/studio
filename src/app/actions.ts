
'use server';

import { createWebsiteFromPrompt } from '@/ai/flows/create-website-from-prompt';
import { diagnoseWebsiteChange } from '@/ai/flows/diagnose-website-change';
import type { WebsiteCode } from '@/ai/schemas';

export async function handleGeneration(
  prompt: string
): Promise<WebsiteCode & { error?: string }> {
  try {
    const websiteCode = await createWebsiteFromPrompt({ prompt });
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
      css: '',
      javascript: ''
    };
  }
}


export async function handleChat(
  text: string,
  image?: string
): Promise<{ response: string; error?: undefined; } | { error: string; response?: undefined }> {
  try {
    const response = await diagnoseWebsiteChange({ text, image });
     return { response };
  } catch (error) {
    console.error('AI chat failed:', error);
    return { error: 'Failed to get a response. Please try again.' };
  }
}


'use server';

import { createWebsiteFromPrompt } from '@/ai/flows/create-website-from-prompt';
import { diagnoseWebsiteChange } from '@/ai/flows/diagnose-website-change';
import type { WebsiteCode } from '@/ai/schemas';

export async function handleGeneration(
  prompt: string
): Promise<WebsiteCode & { error?: string }> {
  try {
    const websiteCode = await createWebsiteFromPrompt({ prompt });
    return websiteCode;
  } catch (error) {
    console.error('AI generation failed:', error);
    let errorMessage = "AI returned an invalid response. Please try again.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
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

'use server';

import { createWebsiteFromPrompt } from '@/ai/flows/create-website-from-prompt';
import { diagnoseWebsiteChange } from '@/ai/flows/diagnose-website-change';

type GenerationResult = {
  text?: string;
  error?: string;
};

export async function handleGeneration(
  prompt: string
): Promise<GenerationResult> {
  try {
    const result = await createWebsiteFromPrompt({ prompt });
    return { text: result.websiteHtml };
  } catch (error) {
    console.error('AI generation failed:', error);
    return { error: 'Failed to process the request. Please try again.' };
  }
}

type ChatResult = {
  response?: string;
  error?: string;
};

export async function handleChat(
  text: string,
  image?: string
): Promise<ChatResult> {
  try {
    const result = await diagnoseWebsiteChange({ text, image });
    return { response: result.response };
  } catch (error) {
    console.error('AI chat failed:', error);
    return { error: 'Failed to get a response. Please try again.' };
  }
}

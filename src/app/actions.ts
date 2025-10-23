
'use server';

import { generateWebsite, type GenerateWebsiteOutput } from './ai/flows/generate-website';
import { diagnoseWebsiteChange } from './ai/flows/diagnose-website-change';

export async function handleWebsiteGeneration(prompt: string): Promise<GenerateWebsiteOutput> {
  // Call the actual AI flow for website generation
  return await generateWebsite(prompt);
}

export async function handleAiChat(text: string, image?: string): Promise<string> {
    // Call the actual AI flow for chat diagnosis
    const result = await diagnoseWebsiteChange({ text, image });
    return result.text;
}

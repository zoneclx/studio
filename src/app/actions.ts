
'use server';

import { generateWebsite, GenerateWebsiteOutput } from "./ai/flows/generate-website";
import { diagnoseWebsiteChange } from "./ai/flows/diagnose-website-change";

export async function handleWebsiteGeneration(prompt: string): Promise<GenerateWebsiteOutput> {
  console.log(`Generating website for prompt: ${prompt}`);
  return await generateWebsite(prompt);
}

export async function handleAiChat(text: string, image?: string): Promise<string> {
    console.log(`AI Chat received: ${text}`, { hasImage: !!image });
    const response = await diagnoseWebsiteChange({ text, image });
    return response.text;
}


'use server';

import { diagnoseWebsiteChange } from './ai/flows/diagnose-website-change';

export async function handleAiChat(text: string, image?: string): Promise<string> {
    // Call the actual AI flow for chat diagnosis
    const result = await diagnoseWebsiteChange({ text, image });
    return result.text;
}

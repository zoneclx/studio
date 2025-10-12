"use server";

import { createWebsiteFromPrompt } from "@/ai/flows/create-website-from-prompt";

type GenerationResult = {
    text?: string;
    error?: string;
}

export async function handleGeneration(prompt: string): Promise<GenerationResult> {
  try {
    const result = await createWebsiteFromPrompt({ prompt });
    return { text: result.websiteHtml };
  } catch (error) {
    console.error("AI generation failed:", error);
    return { error: "Failed to process the request. Please try again." };
  }
}

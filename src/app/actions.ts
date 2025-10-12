"use server";

import { generateTextFromPrompt } from "@/ai/flows/generate-text-from-prompt";
import { summarizeText } from "@/ai/flows/summarize-text";

const SUMMARY_WORD_THRESHOLD = 50;

type GenerationResult = {
    text?: string;
    error?: string;
}

export async function handleGeneration(prompt: string): Promise<GenerationResult> {
  try {
    const wordCount = prompt.trim().split(/\s+/).length;

    if (wordCount > SUMMARY_WORD_THRESHOLD) {
      // Input is long, so summarize it
      const result = await summarizeText({ text: prompt });
      return { text: result.summary };
    } else {
      // Input is short, so treat it as a prompt
      const result = await generateTextFromPrompt({ prompt });
      return { text: result.generatedText };
    }
  } catch (error) {
    console.error("AI generation failed:", error);
    return { error: "Failed to process the request. Please try again." };
  }
}


'use server';

/**
 * @fileOverview A website generation AI agent.
 *
 * - createWebsiteFromPrompt - A function that generates HTML for a website based on a prompt.
 */
import { ai } from '@/ai/genkit';
import { CreateWebsiteFromPromptInput, WebsiteCode, WebsiteCodeSchema } from '@/ai/schemas';

export async function createWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): Promise<WebsiteCode> {
  const { output } = await ai.generate({
    prompt: `You are an expert web developer. Create a complete, single-page website based on the following prompt.
    
    Prompt: "${input.prompt}"
    
    Your response must be a valid JSON object with three keys: "html", "css", and "javascript".
    
    - The "html" key should contain the full HTML structure. It must include a DOCTYPE declaration, head, and body. It should link to "style.css" and "script.js". Use Tailwind CSS classes for styling directly in the HTML.
    - The "css" key should contain any additional CSS. If all styling is done with Tailwind in the HTML, this can be an empty string. Do not include CSS that is already handled by Tailwind.
    - The "javascript" key should contain any necessary JavaScript for interactivity. If no JavaScript is needed, this can be an empty string. Do not include the <script> tags.
    
    Return ONLY the JSON object.`,
    config: {
        responseMimeType: 'application/json',
    },
  });

  if (!output) {
    throw new Error('AI failed to generate a response.');
  }

  // The output from the LLM is a string that needs to be parsed into a JSON object.
  // It might not always be perfect JSON, so we need to handle potential parsing errors.
  try {
    // Sometimes the model might wrap the JSON in markdown backticks.
    const cleanOutput = output.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedOutput = JSON.parse(cleanOutput);
    return WebsiteCodeSchema.parse(parsedOutput);
  } catch (error) {
    console.error("Failed to parse AI response:", output, error);
    throw new Error("The AI returned an invalid JSON structure. Please try again.");
  }
}

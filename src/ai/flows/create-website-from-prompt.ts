
'use server';

/**
 * @fileOverview A website generation AI agent that streams its output.
 *
 * - streamWebsiteFromPrompt - A function that generates HTML for a website based on a prompt and streams the output.
 * - CreateWebsiteFromPromptInput - The input type for the streamWebsiteFromPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateWebsiteFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the website to create.'),
});
export type CreateWebsiteFromPromptInput = z.infer<
  typeof CreateWebsiteFromPromptInputSchema
>;

const WebsiteCodeSchema = z.object({
    html: z.string().describe("The complete HTML code for the website, including the DOCTYPE declaration."),
    css: z.string().describe("The CSS code for styling the website. This can be empty if using only Tailwind."),
    javascript: z.string().describe("The JavaScript code for any interactivity. This can be empty.")
});

export async function* streamWebsiteFromPrompt(
  input: CreateWebsiteFromPromptInput
): AsyncGenerator<string> {
  const { stream } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    stream: true,
    prompt: `You are an expert web developer. A user wants to create a website.

Generate the HTML, CSS, and JavaScript for a visually appealing website based on the user's prompt.

**Requirements:**
1.  **Structure:** Return a single JSON object with three keys: "html", "css", and "javascript".
2.  **HTML:** The 'html' key should contain a complete HTML document, starting with \`<!DOCTYPE html>\`.
3.  **Styling:**
    *   Use Tailwind CSS for styling by including the official CDN script tag in the \`<head>\`.
    *   Link to an external stylesheet named \`style.css\` in the \`<head>\`.
    *   Place any custom CSS into the 'css' key. If no custom CSS is needed, this can be an empty string.
4.  **JavaScript:**
    *   Link to an external script named \`script.js\` before the closing \`</body>\` tag.
    *   Place any JavaScript code into the 'javascript' key. If no JS is needed, this can be an empty string.
5.  **Placeholders:** Use placeholder images from 'https://picsum.photos/' where appropriate (e.g., \`https://picsum.photos/seed/1/800/600\`).
6.  **Output Format:** Ensure the final output is a single, valid JSON object. Do not stream partial JSON.

**User Prompt:**
"{{{prompt}}}"

**Example Output:**
\`\`\`json
{
  "html": "<!DOCTYPE html>...",
  "css": "body { font-family: sans-serif; }",
  "javascript": "console.log('hello world');"
}
\`\`\`
`,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
    input: input,
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

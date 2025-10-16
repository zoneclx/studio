
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const ai = genkit({
  plugins: [googleAI()],
});

const CodeGenerationSchema = z.object({
  html: z.string().describe('The generated HTML code.'),
  css: z.string().describe('The generated CSS code.'),
  js: z.string().describe('The generated JavaScript code.'),
});

export const generateCode = ai.defineFlow(
  {
    name: 'generateCode',
    inputSchema: z.object({
      prompt: z.string(),
    }),
    outputSchema: CodeGenerationSchema,
  },
  async ({ prompt }) => {
    const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: `
        You are a web developer expert. Based on the user's prompt, generate the HTML, CSS, and JavaScript code for a complete webpage.
        
        Prompt: "${prompt}"

        Provide the response as a structured JSON object with keys "html", "css", and "js".
        - The HTML should be a full document.
        - Link the CSS and JS files as 'style.css' and 'script.js' respectively.
        - The CSS should be modern and visually appealing.
        - The JS should be minimal and functional if needed, otherwise can be empty.
      `,
      output: {
        schema: CodeGenerationSchema,
      },
      config: {
        temperature: 0.7,
      }
    });

    return llmResponse.output!;
  }
);

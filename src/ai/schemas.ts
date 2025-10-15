
import { z } from 'zod';

const WebsiteCodeSchema = z.object({
  html: z.string().describe('The HTML body content for the website. Do not include <html>, <head>, or <body> tags. Use semantic HTML5 tags and modern design principles.'),
  css: z.string().describe('The corresponding CSS for the website. It should be clean, modern, and responsive. Use flexbox or grid for layout.'),
  javascript: z.string().describe('The JavaScript for any interactive elements. If no interactivity is needed, return an empty string.'),
});

export const CreateWebsiteInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the website to create.'),
});
export type CreateWebsiteInput = z.infer<typeof CreateWebsiteInputSchema>;

export const CreateWebsiteOutputSchema = WebsiteCodeSchema;
export type CreateWebsiteOutput = z.infer<typeof CreateWebsiteOutputSchema>;

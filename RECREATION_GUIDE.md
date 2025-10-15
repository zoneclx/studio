# Prompt to Recreate the Monochrome AI Website Builder

Hello! I'd like you to build a complete web application called 'Byte AI'. It's a Next.js application that allows users to generate websites from a single text prompt.

**1. Technology Stack:**
*   **Framework:** Next.js with the App Router.
*   **Language:** TypeScript.
*   **UI Components:** ShadCN/UI. Please set up the standard components (Button, Card, Input, Textarea, Tabs, etc.).
*   **Styling:** Tailwind CSS. The app should support both light and dark themes.
*   **Icons:** Use `lucide-react`.
*   **Fonts:** Use `Inter` for the sans-serif font and `Space Grotesk` for the display font.

**2. Core AI Functionality (using Genkit flows):**
*   Create a Genkit flow `createWebsiteFromPrompt` that takes a text prompt and returns mock HTML code for a website.
*   Create another Genkit flow `diagnoseWebsiteChange` that simulates an AI assistant responding to user queries about website changes, with optional image support.
*   Wrap these flows in Next.js server actions: `handleGeneration(prompt: string)` and `handleChat(text: string, image?: string)`.

**3. Visuals & Effects:**
*   **Animated Background:** Implement a subtle, full-screen animated gradient background that is visible on all pages. The gradient colors should adapt for both light and dark themes.
*   **Sound Effects:** Use a lightweight, browser-based synthesizer (like `zzfx`) to create sound effects. Implement a global click sound that plays whenever a user interacts with a button or a link.
*   **Theme Switching:** The application must support both light and dark themes. Include a `ThemeToggle` button in the header to allow users to switch between them. User preference should be saved to `localStorage`.

**4. Pages & Features:**

*   **Homepage (`/`):**
    *   **Header:** Shows the app title "Byte AI," the `ThemeToggle` button, and a user profile icon that acts as a dropdown menu for logged-in users (or a "Sign Up" button for guests).
    *   **Main Content:** A large heading with a `TypewriterEffect` that animates the text: "Build a website with a single prompt." Below this, include a descriptive paragraph. The background should be transparent to show the animated gradient.
    *   **Buttons:** Two prominent buttons: "Start Creating" (links to `/create`) and "Try for Free" (links to `/try`).
    *   **Footer:** A simple footer with copyright text.

*   **Authentication Pages (`/login`, `/signup`, `/forgot-password`):**
    *   Create simple `Card`-based forms for each function. Include a "Back to Home" link at the top of the login and signup pages.
    *   This should be a **simulated authentication system** using `localStorage` to store user credentials and `sessionStorage` to manage the active user session. No real database or Firebase is needed.
    *   The `/forgot-password` page should simulate a secure email flow: after entering an email, show a confirmation message and a button that simulates clicking a link from an email to proceed with the password reset.

*   **Trial Page (`/try`):**
    *   This page is for guests and is a limited version of the main web builder.
    *   It should allow a maximum of **5 website generations** and **5 edits** using the AI assistant.
    *   Track these limits in `localStorage`. The limits should **reset automatically every 24 hours**.
    *   Display the remaining uses clearly. When the limit is reached, show an alert dialog prompting the user to sign up.

*   **Web Builder Page (`/create`):**
    *   This page is for authenticated users only. If a guest tries to access it, redirect them to the signup page.
    *   It should feature a two-column layout.
        *   **Left Column:** A `Card` containing a `Textarea` for the user to describe the website, with some example prompt buttons below it.
        *   **Right Column:** A `Card` with `Tabs` for "Preview" and "Code". The preview should be an `iframe` showing the generated website. Include buttons for "Restart", "Save", and "Share".
    *   An **AI Chat Assistant** component should appear *only after* the first website has been generated. This component allows users to describe changes and optionally upload an image.

*   **My Archive Page (`/my-work`):**
    *   Accessible only to logged-in users via the profile dropdown.
    *   When a user generates a website on the `/create` page, automatically save the latest version (HTML and prompt) to `localStorage`, tied to their user ID.
    *   This page should display the user's last saved creation, showing the prompt, a preview in an `iframe`, and a button to "Continue Editing" which takes them back to `/create` with that prompt loaded.

**5. Key Components:**
*   **`TypewriterEffect`:** A component that animates text as if it's being typed.
*   **`WebBuilder`:** The main component for the `/create` and `/try` pages, handling state for the prompt, output, and AI interactions.
*   **`AiChat`:** The chat interface component.
*   **`AuthProvider`:** A React context to manage the simulated user authentication state.
*   **`ThemeProvider`:** A React context to manage the light/dark theme state.
*   **`useSound` Hook:** A custom hook to provide sound effects throughout the app.

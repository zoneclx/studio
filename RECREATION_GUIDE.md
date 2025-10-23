# Prompt to Recreate the 'Byte AI' Web Application

Hello! I'd like you to build a complete web application called 'Byte AI'. It's a Next.js application that allows users to generate and edit websites using AI.

**1. Technology Stack:**
*   **Framework:** Next.js with the App Router.
*   **Language:** TypeScript.
*   **UI Components:** ShadCN/UI. Please set up the standard components (Button, Card, Input, Textarea, Tabs, etc.).
*   **Styling:** Tailwind CSS. The app should support light, dark, and a special 'redhat' theme.
*   **Icons:** Use `lucide-react`.
*   **Fonts:** Use `Inter` for the sans-serif font and `Space Grotesk` for the display font.

**2. Core AI Functionality (using Genkit):**
*   Create a Genkit flow `generateWebsite` that takes a text prompt and returns an array of files (HTML, CSS, JS) for a complete website.
*   Create another Genkit flow `diagnoseWebsiteChange` that acts as an AI assistant, responding to user queries about website changes, with optional image support.
*   Wrap these flows in Next.js server actions: `handleWebsiteGeneration(prompt: string)` and `handleAiChat(text: string, image?: string)`.

**3. Visuals & Effects:**
*   **Animated Background:** Implement a subtle, full-screen animated gradient background that is visible on all pages. The gradient colors should adapt for light, dark, and redhat themes.
*   **Theme Switching:** The application must support light, dark, and redhat themes. Include a `ThemeToggle` button in the header to allow users to switch between them. User preference should be saved to `localStorage`.
*   **Text Effects:** On the homepage, display an animated `TypewriterEffect`. When the 'redhat' theme is active, switch this to a `HackerEffect` that cycles through technical phrases.

**4. Backend & Authentication (Firebase):**
*   **Firebase Setup:** Configure the project to use Firebase for authentication and Firestore for the database.
*   **Simulated Authentication:** Implement a user authentication system using Firebase Authentication (Email/Password).
*   **User Profiles:** Store user data (UID, email, displayName) in a 'users' collection in Firestore.
*   **Security Rules:** Implement Firestore security rules ensuring a user can only read and write to their own document in the `users` collection.
*   **Profile Management:** The profile page should allow users to update their display name and profile picture. Implement an email verification flow where users can only change their password if their email is verified.

**5. Pages & Features:**

*   **Homepage (`/`):**
    *   **Header:** Shows the app title "Byte Studio," the `ThemeToggle` button, and a user profile dropdown menu for logged-in users (or a "Sign Up" button for guests).
    *   **Main Content:** A large heading with the animated text effect ("Build a website with a single prompt."). Below this, include descriptive paragraphs and feature cards.
    *   **Footer:** A simple footer with navigation links and copyright text.

*   **Authentication Pages (`/login`, `/signup`, `/forgot-password`):**
    *   Create simple `Card`-based forms for each function using Firebase Authentication.
    *   The `/forgot-password` page should use Firebase's `sendPasswordResetEmail` function.

*   **Web Editor Page (`/create`):**
    *   This page should be for authenticated users only. If a guest tries to access it, redirect them to the signup page.
    *   Initially, it should show a `WebBuilder` component prompting the user to generate a site.
    *   After generation, it should transition to a multi-panel editor layout:
        *   **File Explorer:** A panel listing the generated files (`index.html`, `style.css`, `script.js`).
        *   **Code Editor:** A `Textarea`-based editor to modify the content of the selected file.
        *   **Preview/AI Chat Panel:** A tabbed view with an `iframe` for live preview and an `AiChat` component for making iterative changes.
        *   **Terminal:** A simulated terminal panel to show logs from the preview's JavaScript.
    *   Include buttons for "Save", and "Share".

*   **My Projects Page (`/my-archive`):**
    *   Accessible only to logged-in users via the profile dropdown.
    *   When a user saves a project, store it in `localStorage` under their user ID.
    *   This page should display a grid of the user's saved projects, allowing them to open a project in the editor.

**6. Key Components:**
*   **`WebEditor`:** The main component for the `/create` page, handling the multi-panel layout, state for files, active file, preview content, and terminal output.
*   **`WebBuilder`:** The initial component shown on `/create` to prompt for website generation.
*   **`AiChat`:** The chat interface component for interacting with the `diagnoseWebsiteChange` flow.
*   **`AuthProvider`:** A React context to manage the Firebase user authentication state, including sign-in, sign-up, sign-out, and profile updates.
*   **`ThemeProvider`:** A React context (`next-themes`) to manage the light/dark/redhat theme state.
*   **Layout Components:** A `Header` and `Footer` component to be used across the application.
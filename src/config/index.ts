/** Central app configuration. */

// Base URL of the live MiniSearch backend API.
// Override locally with VITE_API_BASE in a .env file.
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "https://minisearch-core-api.onrender.com";

export const APP_NAME = "MiniSearch";

// Default search placeholder (Malayalam, like the mockups).
export const SEARCH_PLACEHOLDER = "MiniSearch-ൽ തിരയുക...";

// Request timeout for API calls.
export const API_TIMEOUT_MS = 20000;

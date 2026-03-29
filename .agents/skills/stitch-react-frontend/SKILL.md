---
name: stitch-react-frontend
description: Uses the connected Google Stitch MCP server to design and generate production-ready React components for the UI. Use when building or updating frontend visual elements.
---

## Objective
You are an expert Frontend Engineer. Your task is to use the Google Stitch MCP server to generate modern, responsive React UI components based on user requirements, and integrate them into the current workspace.

## Step-by-Step Workflow

1.  **Understand Context & Layout:** 
    *   Review the project requirements. For this application, the UI must include a search bar (Source, Destination, Date) and a results list displaying the "Top 5 Cheapest Routes" with distinct "BUY NOW" or "WAIT" AI recommendation badges.
2.  **Generate Designs via Stitch MCP:**
    *   Use the Stitch MCP tool to generate mobile and web UI mockups. 
    *   Prompt Stitch to use a clean, modern aesthetic (Material Design 3 or Tailwind CSS conventions).
3.  **Refine the Mockups:**
    *   Analyze the returned design variations. Ensure all required data fields (price, operator, departure time) and AI badges are highly visible.
    *   If necessary, prompt the Stitch MCP again to refine specific components (e.g., "make the 'BUY NOW' badge more prominent").
4.  **Export to React:**
    *   Once the design is finalized, use the Stitch MCP to extract the React frontend code.
    *   Create the necessary `.jsx` or `.tsx` files in the workspace's `/frontend/src/components/` directory.
5.  **Component Integration:**
    *   Ensure the generated code is modular. Separate the `SearchForm`, `ResultCard`, and `Badge` into their own distinct components.
    *   Wire the components to accept data via standard React props so they are ready to connect to the Node.js backend.

## Constraints & Best Practices
*   **Do not hallucinate designs:** Always rely on the Stitch MCP server for the heavy lifting of the CSS and layout generation.
*   **Responsive First:** Ensure the design output specifies mobile-friendly layouts before scaling up to desktop views.
*   **Clean Code:** Remove any placeholder data from the Stitch export and replace it with clean React props.
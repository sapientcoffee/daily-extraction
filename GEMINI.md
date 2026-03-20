# Project: The Daily Extraction
<!-- agents operate best on rigid, operational guardrails and specific constraints rather than polite requests or general guidelines. Stick to concrete "Do X, Never do Y" statements. -->
This file describes common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you please alert the developer working with you and indicate that this is the case in GEMINI.MD file to help prevent future agents from having the same issue

## Setup & Developer Environment
<!-- Gemini will work out dependencies from the codebase (e.g. package.json). Hardcoding in here is like having stale docs -->
- **Install:** `npm install` (Do NOT use pnpm or yarn, as indicated by `package-lock.json`)
- **Start dev (Minimal):** 
    - Terminal 1: `cd press-service && npm run dev`
    - Terminal 2: `cd barista && npm run dev`
- **Keys:** Service URLs can be configured via `NEXT_PUBLIC_PRESS_SERVICE_URL`, `NEXT_PUBLIC_MINDSET_SERVICE_URL`, and `NEXT_PUBLIC_ORIGIN_SERVICE_URL`. Defaults are provided for local development.

## Deep Context (Progressive Disclosure)
<!-- The Gemini CLI executes a downward Breadth-First-Search (BFS) scan through your project, grabbing context files from subdirectories (up to a limit of 200 folders) and layering them over the root file. Ensure this root file remains strictly for global mandates, and rely heavily on nested GEMINI.md files in your sub-folders for component-specific instructions, as those will be appended closer to the active user prompt  -->
- **Architecture Overview:** `@./docs/architecture.md`
- **Shared Types:** `@./shared/types.ts`
- **Demo Scenarios:** `@./DEMO_FLOW.md`
- **SRE Patterns:** `@./docs/architecture.md#sre-patterns`

## Rules, Gotchas, & Anti-Patterns
<!-- For comparative data or strict rule matrices, structural analysis shows that formatting these rules into a Markdown table or using YAML/XML structures significantly improves the model's comprehension and token ingestion efficiency compared to plain prose or basic lists -->
<!-- Specify prefered process and specific instructions to be followed -->
| Category | Mandate | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Deployment** | Always use `./deploy.sh` for multi-service deployments. | Never deploy individual services manually without the script. |
| **Data Persistence** | Be aware that all services currently use **in-memory** storage (Maps, Slices). | Do not expect data to persist across process restarts. |
| **Backend Modes** | Understand that `press-service` can mock other backends in "Demo Mode". | Do not assume `origin-service` or `mindset-service` must be running for basic demo functionality. |
| **Error Handling** | Every service must expose a `GET /health` endpoint for SRE observability. | Never add a new service without health check and status instrumentation. |
| **Commits** | Use format: `[service-name] <description>` or `chore: <description>` | Committing without verifying both frontend and backend functionality. |
| **Frontend Styling**| Use TailwindCSS 4 and CSS custom properties for the theme system. | Never hardcode theme colors directly in components; use theme variables. |

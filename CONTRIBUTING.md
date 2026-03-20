# Contributing to The Daily Extraction

Thank you for your interest in contributing to The Daily Extraction! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

| Tool | Minimum Version | Required For |
|------|-----------------|--------------|
| Node.js | 18+ | Barista (frontend), Press Service |
| Go | 1.22+ | Origin Service *(optional)* |
| Python | 3.10+ | Mindset Service *(optional)* |
| npm | 9+ | Package management |

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daily-extraction
   ```

2. **Install dependencies for the frontend**
   ```bash
   cd barista && npm install
   ```

3. **Install dependencies for the Press Service**
   ```bash
   cd press-service && npm install
   ```

4. **Start developing** — See the [Quick Start guide](./README.md#quick-start) in the main README.

## Project Structure

The project is organized as a monorepo with four independent services:

| Directory | Language | Description |
|-----------|----------|-------------|
| `barista/` | TypeScript (Next.js) | Frontend dashboard |
| `press-service/` | JavaScript (Express) | Backend API gateway |
| `origin-service/` | Go | Coffee data API |
| `mindset-service/` | Python (FastAPI) | Psychology tips API |
| `shared/` | TypeScript | Shared type definitions |

Each service has its own `README.md` with service-specific documentation.

## Code Style

### TypeScript / JavaScript
- Use ESLint with the project's existing configuration
- Prefer `const` over `let`; avoid `var`
- Use TypeScript interfaces for data shapes
- Components should be functional with React hooks

### Go
- Follow standard Go formatting (`gofmt`)
- Use meaningful variable names
- Group imports: standard library, then external packages

### Python
- Follow PEP 8 style guidelines
- Use type hints where possible
- Keep functions focused and testable

## Making Changes

### Adding a New Component (Frontend)
1. Create the component in `barista/src/components/`
2. Use the existing theme system (CSS custom properties via `var(--*)`)
3. Include the terminal prompt indicator pattern: `<span style={{ opacity: 'var(--terminal-opacity)' }}>&#62;_</span>`
4. Import and integrate in `page.tsx`

### Adding a New API Endpoint (Press Service)
1. Add the route handler in `press-service/src/index.js`
2. Document the endpoint in the Press Service README
3. If it's a new module, create a separate file in `src/`

### Adding New Tips (Mindset Service)
1. Add new tip objects to the `TIPS` array in `mindset-service/tips.py`
2. Follow the existing schema: `id`, `title`, `tip`, `author`
3. Update the mock tips in `press-service/src/index.js` to match

### Adding New Coffee Data (Origin Service)
1. Add entries to the data slices in `origin-service/handlers/beans.go` or `brew.go`
2. Update the mocked data in `press-service/src/index.js` to match

## Keeping Services in Sync

Since the Press Service mocks the Origin and Mindset services, **keep the mock data in sync** when updating the standalone services:

- **Beans/Brew data:** Update both `origin-service/handlers/` and `press-service/src/index.js`
- **Tips data:** Update both `mindset-service/tips.py` and `press-service/src/index.js`
- **Shared types:** Update `shared/types.ts` when adding new fields

## Testing

Currently, testing is manual. When running all services:

1. Verify the health endpoints: `GET /health` on each service
2. Check the frontend loads all panels without errors
3. Test feed management (add, remove, verify notes refresh)
4. Test theme toggling (switch + page refresh for persistence)
5. Trigger the Chaos Button and verify visual feedback

## Pull Request Guidelines

1. **One concern per PR** — Keep changes focused
2. **Update documentation** — If you change APIs or add features, update relevant READMEs
3. **Test your changes** — Verify the frontend works end-to-end with the press-service
4. **Describe what and why** — Provide context in your PR description

# Plan: AI-driven Chaos Mitigation and Runbook Integration (Issue #4)

## Objective
Implement an AI-driven mitigation mechanism for chaos events simulated in the `press-service`. This features a Google Doc runbook (stored in a "runtime" folder in Google Drive), an AI skill to execute mitigation steps, and frontend UI components in `barista` to visualize the resolution process.

## Key Files & Context
- `press-service/src/index.js` (Backend API)
- `runtime/` (Google Drive folder for the runbook)
- `.agents/skills/chaos-mitigation/SKILL.md` (New Gemini Skill)
- `barista/src/components/ChaosResolution.tsx` (New UI Component)
- `barista/src/app/page.tsx` (Frontend Entry)
- `barista/src/app/api/chaos/route.ts` (Frontend Proxy API)

## Implementation Steps

### Phase 1: Backend Mitigation Endpoint & State Tracking
1. Update `press-service/src/index.js` to track a boolean `isChaosActive` state.
2. Update `POST /chaos` to set `isChaosActive = true`.
3. Add a `DELETE /chaos` (or `POST /chaos/mitigate`) endpoint that sets `isChaosActive = false` and logs a successful mitigation message (e.g., "Lightning Strike Synchronization complete. 1.21 Gigawatts delivered.").
4. Add a `GET /chaos/status` endpoint (or update `/health`) to expose the current `isChaosActive` status for the frontend.

### Phase 2: Google Doc Runbook Creation
1. Use Google Workspace MCP tools to find or create a `runtime` folder in Google Drive.
2. Create a Google Doc named `chaos-mitigation-runbook` inside the `runtime` folder.
3. Detail the exact signature of the error (e.g., `fluxcapacity not fluxing` and `1.21 GIGGAWATS REQUIRED!`) in the document.
4. Provide the explicit mitigation step: "Execute Lightning Strike Synchronization by calling the DELETE /chaos endpoint."

### Phase 3: AI Mitigation Skill Setup
1. Create `.agents/skills/chaos-mitigation/SKILL.md`.
2. Provide instructions for the agent to:
   - Use Cloud Observability (`mcp_observability_list_log_entries`) to scan logs for "fluxcapacity not fluxing".
   - Use the `google-workspace` MCP tools (specifically `drive.search` and `docs.getText`) to locate and read the Google Doc runbook in the `runtime` folder.
   - Call the mitigation endpoint using `run_shell_command` with `curl` to trigger the backend resolution.

### Phase 4: Frontend Resolution UI (`barista`)
1. Create a `GET /api/chaos/status` proxy route in `barista`.
2. Create a `DELETE /api/chaos` proxy route in `barista`.
3. Implement `ChaosResolution.tsx` that polls the backend status when chaos is active.
4. Update `ChaosButton.tsx` and the main `page.tsx` to display the `ChaosResolution` component when a chaos event is triggered.
5. Provide a visual confirmation (e.g., "Issue Resolved" banner) when the AI agent successfully mitigates the chaos and the backend state returns to normal.

## Verification & Testing
1. Click the "INITIATE CHAOS" button in the Barista dashboard.
2. Confirm `press-service` logs the "Back to the Future" errors and sets the active state.
3. Activate the `chaos-mitigation` skill via Gemini CLI and ask it to mitigate the issue.
4. Verify the agent successfully reads the logs, finds and reads the Google Doc runbook, and calls the `DELETE` endpoint.
5. Verify the Barista frontend automatically detects the state change and displays the "Issue Resolved" UI.

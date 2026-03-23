---
name: postmortem-generator
description: Generate a postmortem following SRE good practices. Use this skill when the user asks to "write a postmortem," "create an incident report," or "document a system failure." It guides gathering troubleshooting context (logs, traces), applying a standard SRE template, and saving the result locally and to Google Docs.
---

# Postmortem Generator

This skill enables Gemini CLI to generate high-quality SRE postmortems by automating context gathering and ensuring adherence to industry-standard templates.

## Workflow

### 1. Gather Incident Context
First, gather all relevant data from the incident. If the user provides a `time_range` or a specific incident window, prioritize automated extraction:
- `mcp_observability_list_log_entries`: Search for error/warning logs (severity >= WARNING) within the specified timeframe.
- `mcp_observability_list_traces` and `get_trace`: Analyze request paths during the incident window.
- `mcp_observability_list_group_stats`: Identify recurring error patterns for automated impact summary.
- `grep_search`: Correlate unique error strings from logs to specific source code locations.

**Instruction:** Capture exact error messages, timestamps, and service components. Store critical log snippets for use in the final report.

### 2. Generate Postmortem Draft
Use the SRE template provided in `references/sre-template.md` to structure the report.

**Instruction:**
- Read the template: `read_file(".agents/skills/postmortem-generator/postmortem-generator/references/sre-template.md")`.
- Fill in each section based on the gathered data.
- **AUTOMATION MANDATE:** The "Troubleshooting & Context" section MUST be prepopulated with 2-3 JSON log snippets extracted during Step 1 that demonstrate the failure state (e.g., specific ERROR payloads or IAM rejection messages).
- Use clear headings for each section.

### 3. Review and Refine
Present the draft to the user for feedback before finalization.

### 4. Save and Distribute
Once approved, save the postmortem in two locations:

#### A. Local Save
Save the postmortem to the `postmortem/` directory in the project root.
- Use `write_file(file_path="postmortem/postmortem-[YYYY-MM-DD]-[title].md", content=draft)`.
- Ensure the directory exists.

#### B. Google Docs Save
Save the postmortem to a Google Doc.
- **Prerequisite:** Ensure the `google-docs` skill is activated if not already.
- Use `mcp_google-workspace_docs.create(title="Postmortem: [Incident Title]", content=draft)`.
- Inform the user of the new document's URL.

## Guidelines
- **Blameless Culture:** Focus on process and system failures rather than individual mistakes.
- **Data-Driven:** Every claim (especially impact and timeline) should be backed by the data gathered in Step 1.
- **Actionable:** Every action item should have a clear owner and purpose (Preventive or Corrective).

## Examples

- **User:** "Write a postmortem for the crash we had today between 2 PM and 3 PM."
- **Action:**
  1. Define `time_range` (e.g., `2025-01-01T14:00:00Z` to `15:00:00Z`).
  2. Gather logs within that range using `mcp_observability`.
  3. Extract 2-3 specific JSON error payloads from the results.
  4. Identify the root cause (e.g., OOM in `press-service`).
  5. Draft the report, auto-populating the "Troubleshooting & Context" section with the extracted logs.
  6. Save locally to `postmortem/` and create a Google Doc.

# Postmortem: [Incident Title]

**Date:** [YYYY-MM-DD]
**Authors:** [Author Names]
**Status:** [Draft/Review/Final]

## Summary
Brief overview of what happened, why it happened, and how it was resolved. Include the duration and overall impact.

## Impact
- **Users affected:** [e.g., 100% of users in US-EAST-1]
- **Duration:** [e.g., 45 minutes]
- **Key Metrics:** [e.g., 500 errors, latency increased by 200ms]

## Root Cause
Detailed explanation of the technical cause of the incident.

## Trigger
What event started the incident (e.g., a code deployment, config change, or external spike).

## Resolution
How the incident was mitigated and eventually resolved.

## Detection
How was the incident detected? (e.g., automated alerting, user report, manual observation). Could it have been detected sooner?

Example log entries used to help identify root cause. 

## Action Items
| Action Item | Type | Owner | Bug Link |
| :--- | :--- | :--- | :--- |
| [Fix the underlying bug] | Corrective | [Name] | [URL] |
| [Add alerting for X] | Preventive | [Name] | [URL] |

## Lessons Learned
- **What went well?**
- **What went wrong?**
- **Where did we get lucky?**

## Timeline
All times in [Timezone].
- **[HH:MM]**: [Event Description]
- **[HH:MM]**: [Event Description]
- ...

## Troubleshooting & Context
Detailed technical context gathered during the incident (logs, traces, error messages).
[Include relevant logs or data here]

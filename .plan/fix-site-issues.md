# Site Issues Remediation Plan

## Objective
Address the root causes of the recent user complaints and site instability identified in the logs.

## Background & Motivation
A review of Cloud Logging revealed two primary issues causing site failures:
1. **Chaos Mode Active**: The `press-service` was intentionally placed into a Chaos Engineering state, continuously logging "1.21 GIGGAWATS REQUIRED!" and "Temporal displacement failure", and simulating failures.
2. **Authentication Failures (403 Forbidden)**: The `barista` frontend is failing to authenticate its requests to `press-service`, `mindset-service`, and `origin-service`. Cloud Run is rejecting the requests with `403 Forbidden` ("The request was not authenticated").

## Proposed Solution
1. **Mitigate Chaos Mode**: The active chaos state was immediately mitigated by making a `DELETE` request to the `/chaos` endpoint on `press-service`.
2. **Fix Service-to-Service Authentication**: Update `barista/src/utils/gcpAuth.ts` to ensure the `targetAudience` is properly URL-encoded when fetching the identity token from the GCP Metadata Server, preventing the metadata server from returning an invalid or malformed token.

## Implementation Steps
1. In `barista/src/utils/gcpAuth.ts`, modify the fallback metadata fetch to properly encode the target audience:
   ```typescript
   const encodedAudience = encodeURIComponent(targetAudience);
   const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodedAudience}`;
   ```
2. Verify the fix by testing the `barista` API routes.

## Verification & Testing
- Ensure the `barista` UI successfully fetches brewing methods, random tips, and release notes without `403 Forbidden` errors.
- Confirm `isChaosActive` remains false on `press-service`.
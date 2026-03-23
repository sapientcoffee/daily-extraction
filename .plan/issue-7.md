# Implementation Plan: Personalization Profile (Issue #7)

## Objective
Implement a feature allowing users to save their preferred coffee brewing method in a user profile. This involves updating shared types, adding in-memory persistence and endpoints to the Go-based Origin Service, and building the UI and API proxy in the Next.js Barista frontend.

## Key Files & Context
- **Shared Definitions:** `shared/types.ts`, `origin-service/models/types.go`
- **Origin Service (Backend):** `origin-service/main.go`, `origin-service/handlers/profile.go` (new)
- **Barista (Frontend):** `barista/src/app/api/profile/route.ts` (new), `barista/src/components/UserProfile.tsx` (new), `barista/src/app/page.tsx`

## Implementation Steps

### Phase 1: Shared Data Contracts
1. **`shared/types.ts`**:
   - Add a `UserProfile` interface containing an `id` (string) and a `preferredBrewMethodId` (string, optional).
2. **`origin-service/models/types.go`**:
   - Add an equivalent `UserProfile` struct with JSON tags: `ID` and `PreferredBrewMethodID`.

### Phase 2: Origin Service (Go Backend)
1. **`origin-service/handlers/profile.go`** (New File):
   - Define a global in-memory variable (e.g., `var userProfile models.UserProfile`) to act as the datastore for the single demo user.
   - Implement `GetProfile(w http.ResponseWriter, r *http.Request)`: Returns the current `userProfile` as JSON.
   - Implement `UpdateProfile(w http.ResponseWriter, r *http.Request)`: Parses the incoming JSON body, updates the in-memory `userProfile`, and returns the updated profile.
   - Ensure both handlers implement the existing CORS wrapper logic.
2. **`origin-service/main.go`**:
   - Register the new routes in the `main` function:
     - `http.HandleFunc("GET /profile", handlers.GetProfile)`
     - `http.HandleFunc("POST /profile", handlers.UpdateProfile)`

### Phase 3: Barista (Next.js Frontend)
1. **`barista/src/app/api/profile/route.ts`** (New File):
   - Implement `GET` and `POST` handlers that proxy requests to the Origin Service's `/profile` endpoint.
   - Ensure these requests utilize the existing GCP authentication pattern (`utils/gcpAuth.ts`).
2. **`barista/src/components/UserProfile.tsx`** (New File):
   - Create a client-side component (`"use client"`).
   - Fetch available brew methods from `/api/brew`.
   - Fetch the current user profile from `/api/profile`.
   - Render a dropdown/select input allowing the user to choose their preferred brew method.
   - Implement a save action that issues a `POST` request to `/api/profile` and updates the local state.
3. **`barista/src/app/page.tsx`**:
   - Import and integrate the `<UserProfile />` component into the main dashboard layout, likely alongside or above the `BrewingGuide`.

## Verification & Testing
1. Ensure both the Origin Service and Barista start successfully (`npm run dev` in both directories).
2. Verify the `UserProfile` component renders correctly in the frontend.
3. Confirm that selecting a new brewing method and saving it successfully persists the data in the Origin Service's memory (refreshing the page should retain the selection).
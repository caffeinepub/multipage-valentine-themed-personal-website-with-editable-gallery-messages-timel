# Specification

## Summary
**Goal:** Allow any authenticated Internet Identity user (not just admins) to edit the deployed draft content, while keeping guests unable to modify content.

**Planned changes:**
- Backend: Remove the admin-only restriction from all content-modification methods for gallery items, love messages, timeline milestones, interactive surprise config, and final dedication; require the caller to be authenticated.
- Backend: Keep all existing query (read-only) methods publicly accessible as they are.
- Frontend: Verify the existing Edit Content UI works end-to-end after the backend permission change, including successful saves and React Query invalidation-driven refreshes for updated lists.

**User-visible outcome:** Any logged-in Internet Identity user can create/update/delete/reorder content and save changes from the Edit Content page, with updates reflected immediately in the UI; guests can still only view content.

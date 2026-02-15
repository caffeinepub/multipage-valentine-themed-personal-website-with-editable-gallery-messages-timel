# Specification

## Summary
**Goal:** Add clear in-app guidance and accurate version-specific “live” status so users understand how to make a specific version publicly visible and shareable.

**Planned changes:**
- Add a “Go Live” guidance section on the Edit page with a short checklist explaining that users must publish the current draft before visitors can see updates, then copy/share the version-specific link (`?v=<version>`).
- Update the Edit page publishing UI to show a prominent status indicator for the active version (e.g., “Not published yet” vs “Live”).
- Ensure the share link for the active version is always accessible on /edit, including a one-click copy action that uses the existing versioned share URL format.
- Update backend publish-status tracking to be version-specific (e.g., `isPublished`, `lastPublished`, `draftLastUpdated` per version) so the frontend can display correct “live” status for the active version.

**User-visible outcome:** On the Edit page, users can follow clear steps to make the current version live, see whether the active version is published, and copy the correct version-specific share link at any time.

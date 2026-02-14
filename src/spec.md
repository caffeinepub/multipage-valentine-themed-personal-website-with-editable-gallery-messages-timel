# Specification

## Summary
**Goal:** Make the publishing workflow in the editor unambiguous and provide an obvious, reliable way for users to trigger the correct chat-level publish flow when the Publish button doesn’t appear.

**Planned changes:**
- Add a prominent, always-visible “Publishing” (or “How to Publish”) callout near the top of the **Edit Content** page, positioned above the tabs near the existing DraftReviewSummary.
- In the callout, clearly explain in plain English that editor actions save a **draft**, and that **publishing the live site** happens outside the editor via the platform/chat publish action.
- Add a single primary CTA in the callout (e.g., “Copy publish request message”) that copies a short, explicit message the user can paste into chat to request a rebuild/resurface of the Publish button.
- Show a success confirmation after copying; if clipboard access isn’t available, show the message in a selectable text area for manual copying.
- Ensure the change is UI-only, non-destructive, readable on mobile/desktop, and uses high-contrast styling consistent with the existing romantic theme (composing existing UI components only).

**User-visible outcome:** On /edit, users see a clear Publishing callout that explains draft vs live publishing and provides a one-click way to copy a message to paste into chat to make the Publish flow appear, without changing any site content.

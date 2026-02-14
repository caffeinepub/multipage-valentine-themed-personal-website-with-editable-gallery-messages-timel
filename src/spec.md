# Specification

## Summary
**Goal:** Build a fully responsive, Valentine-themed multipage personal website with a cohesive romantic design and an in-app editor that persists all content (gallery, messages, timeline, and surprises) to a Motoko backend.

**Planned changes:**
- Create responsive navigation and pages: Home, Our Memories (Photo Gallery), Love Messages, Timeline, Interactive Surprise, and Final Dedication (all English copy).
- Apply a consistent romantic visual theme (pastel palette with rose-gold accents, elegant typography, subtle transitions/animations).
- Home page: hero section with background image, romantic headline, and subtle heart/love animations.
- Our Memories page: carousel/slideshow with smooth transitions, captions under each photo, and touch-friendly controls.
- Love Messages page: multiple envelope/message cards with click-to-open animations and support for long readable notes.
- Timeline page: chronological milestones with date/title/description, optional photo, and interactive expand/collapse or step-by-step browsing.
- Interactive Surprise page: surprise button reveal, a multi-question love quiz with results, flip cards, and heart animations on tap/click.
- Final Dedication page: closing love note area and signature/sign-off section.
- Add a discoverable in-app Edit mode to add/edit/remove/reorder gallery items, love messages, and timeline milestones (drag-and-drop where appropriate) and edit key text fields.
- Implement Motoko canister APIs to store/retrieve all editable content (including ordering) and wire the frontend to load/save via these APIs with persistence across reloads.

**User-visible outcome:** Visitors can browse a romantic multipage Valentine website with animated interactions, and the owner can enter Edit mode to update photos, captions, messages, timeline milestones, and surprise content with changes saved persistently.

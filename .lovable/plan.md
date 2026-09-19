# Letters I Never Sent

## Goal
Add a new, independent daily-letter journal to the existing story. It will remain fully static and grow automatically from entries added to the central content file.

## What will be built

### 1. One editable letters collection
- Add a typed `dailyLetters` collection inside the existing central `manniConfig` file.
- Each entry supports: `id`, a sortable date, displayed date, title, preview, typed content, optional handwritten image, `isNew`, `isToday`, and optional “Until tomorrow.” closing.
- Sort newest-first in the interface, so adding another object updates the archive without changing page code.
- Keep `/assets/letters/...` as the simple optional path format for future handwritten scans.

### 2. A separate journal chapter
- Insert **Letters I Never Sent** as its own chapter after the personal-message experience and before the quiet ending.
- Keep the existing locked private folder unchanged as the special collection.
- Renumber the later journey chapters so the sequence remains clear.
- Show the requested subtitle and a quiet count such as “2 letters”; if there are none, omit the archive without showing an error or return prompt.

### 3. Physical letter archive
- Build reusable `DailyLettersSection`, `LetterArchive`, `LetterEnvelope`, and `LetterCard` pieces.
- Render a touch-friendly newest-first stack/grid of cream envelopes with date stamps, title, preview, and restrained open control.
- Give `isNew` entries a small “NEW” stamp and `isToday` entries a distinct but subtle “TODAY’S LETTER” treatment.
- Preserve mature stationery styling: paper grain, dusty rose and burgundy accents, fine borders, gentle shadows, serif and handwritten details.

### 4. Opening and reading experience
- Tapping an envelope lifts and unfolds it over roughly 0.7 seconds before revealing the reading view.
- Build `LetterViewer` for comfortable typed reading on phones, with date, title, spacious text, optional configured closing, and “← Back to the letters.”
- Keep long letters scrollable without horizontal overflow and restore the archive cleanly when closed.
- Use accessible dialog/focus behavior and the existing design-system controls.

### 5. Handwritten image support
- Build `LetterImageViewer` for optional handwritten scans.
- If an image exists, show it first with pinch zoom plus visible zoom controls.
- If both image and typed content exist, offer “Read the typed version” without hiding either version permanently.
- If an image path fails, fall back gracefully to typed content rather than showing a broken image.

### 6. Motion and responsive polish
- Add envelope-flap, paper-lift, and reading-sheet transitions that match the current site and stop under reduced-motion preferences.
- Verify the archive, today/new states, typed/image switching, pinch zoom, back navigation, long-letter scrolling, and no horizontal overflow on an iPhone-sized viewport.

## Technical notes
- New UI lives in a focused daily-letters component module rather than expanding the existing journey file with letter internals.
- Content remains in `src/data/config.ts`; no backend, login, database, CMS, or date-based pressure logic.
- Existing semantic colors, stationery classes, fonts, and button components remain authoritative.

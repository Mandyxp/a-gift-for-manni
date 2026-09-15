# Unlock rules, one song removed, better hint, and a more alive page

## 1. The keepsake box rules

- The word search is no longer required. Finishing the memory quiz alone turns the key.
- The "Open without the key" shortcut is removed entirely — there is no way past it anymore.
- Helper line under the disabled button becomes "Answer the memory quiz above to turn the key."
- Quiz completion copy changes from "The first half of the key is yours." to "The key is yours."
- The word search stays fully playable and still reveals the hidden phrase; it just no longer gates the box.

## 2. Remove Summertime Sadness

The 4.36 MB upload matches the third stored track.

- Drop that track from the hidden playlist (3 songs remain) and delete its stored pointer.
- Random start, auto-advance when a song ends, and the shuffle button keep working unchanged.

## 3. Better first quiz hint

- Hint becomes: `"My heart feels like ____ with you."` (answer stays "home", also accepts "our home").

## 4. More animated, dynamic, stylish — with cute touches

Keeping the blush/ivory stationery mood, not adding cartoon clutter:

- Sections fade and rise into view as she scrolls (IntersectionObserver-driven reveal, staggered children).
- Soft parallax on the opening title and the night-sky distance section; drifting paper particles get a gentler, longer float.
- Pressed-flower easter egg, quiz key, and the box lid get springier reveal animations; the key "turns" before the lid lifts.
- Cute-but-tasteful details: tiny hand-drawn hearts and pressed-petal marks as section dividers and list bullets, a small wax-seal motif on the letters folder, a gentle sway on hover for photo prints, ribbon accent on the keepsake box.
- Buttons and cards get soft lift/press feedback; word-search letters pop when found and the found word draws a hand-inked strikethrough.
- Everything respects reduced-motion: animations collapse to plain fades or nothing.

## Technical notes

- New keyframes/utilities in `src/styles.css` (reveal, float, sway, seal, ribbon, petal bullets) using existing tokens only — no hardcoded colors.
- A small `useReveal` hook plus a `Reveal` wrapper inside `src/components/manni/MemoryJourney.tsx`; applied to chapter headers, cards, and gallery items.
- `canUnlock` becomes `quizComplete`; delete the bypass button; copy edits in `src/data/config.ts` (quiz hint, quiz completion, remove `lockedBox.bypassLabel`, drop one `audio.tracks` entry and its import).
- Delete `src/assets/track-76795895.mp3.asset.json`.

## Verify

Playwright on mobile 390 and desktop: scroll reveals fire, key enables after quiz only, no bypass button exists, three tracks load, hint reads correctly, no console errors.

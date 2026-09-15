# Unlock without the word search + remove one song

## 1. Locked folder no longer needs the puzzle

Today the "Turn the key" button stays disabled until both the quiz AND the word search are finished (`canUnlock = quizComplete && puzzleComplete` in `src/components/manni/MemoryJourney.tsx`).

Change it so only the memory quiz is required:

- `canUnlock` becomes just `quizComplete`.
- Update the small helper line under the button from "Complete both keepsakes above—or continue without them." to wording about the quiz only (e.g. "Answer the memory quiz above—or continue without it.").
- Adjust the quiz completion copy in `src/data/config.ts` from "The first half of the key is yours." to "The key is yours." since there is no second half requirement anymore.
- The word search itself stays exactly as it is — it's still playable, still reveals "I LOVE YOU MOMMY", and the bypass ("Open without the key") still exists.

## 2. Remove Summertime Sadness from the hidden playlist

The 4,365,000-byte upload matches `track-76795895.mp3`, so:

- In `src/data/config.ts`: delete the `trackC` import and remove it from `audio.tracks` (leaving 3 tracks).
- Delete `src/assets/track-76795895.mp3.asset.json`.
- Nothing else changes — random start, auto-advance, and the shuffle button already work with any track count (shuffle only needs 2+).

## Verify

- Playwright (mobile viewport): unlock button is enabled right after finishing the quiz alone; the three remaining tracks still load; no console errors.

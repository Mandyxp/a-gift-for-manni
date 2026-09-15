# Clearer hidden-phrase hint + shuffling background music

## The hidden phrase

Replace the faint dots with a readable puzzle clue:

- Show it as blanks in word shapes with the first letters given, e.g. `I  L _ _ _  Y _ _  M _ _ _ _` — clearly four words, letter counts visible.
- Reword the hint to something guessable but still private: "Four words, 13 letters. The three you said back every night — and the name only you called yourself."
- Once she finds it in the grid, it still reveals fully as "I LOVE YOU MOMMY".

## Music

- All four tracks you sent become a hidden playlist. No titles, no list, nothing named anywhere on the page.
- A random track starts as soon as she taps "Begin" (browsers block sound before a tap, so this is the earliest moment it can play without breaking).
- When a track ends, another one is picked at random and plays next, so it keeps cycling on its own.
- Two small controls in the corner: the existing mute/unmute, plus a minimalist "shuffle" button that jumps to a different random track instantly.
- Nothing shows which song is playing.

## Technical details

- Upload the 4 mp3s as CDN-hosted assets and reference their pointers from `src/data/config.ts` under an `audio.tracks` array (replacing the single `src` / `available` placeholder). Keep names out of the config's display fields.
- In `MemoryJourney.tsx`: track index state, random pick helper that never repeats the current track, `onEnded` handler advancing randomly, start playback on the "Begin" click, add a Shuffle icon button next to the volume toggle.
- Update the masked word entry's `mask` and `hint` in `src/data/config.ts` only; no word-search logic changes.
- Verify on mobile and desktop that the mask reads clearly and that playback starts and shuffles after Begin.

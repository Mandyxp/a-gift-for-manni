# Add your 8 photos to the scrapbook (plus music and letters later)

## What I'll do now

- Add all 8 images you just uploaded to the scrapbook section, replacing the 4 empty placeholder slots.
- The gallery already adapts to any number of photos, so all 8 will lay out in a natural, tilted paper-print arrangement.
- Give each one a short, gentle caption in the same voice as the rest of the page. The screenshots (the messages) get quiet captions like "Words you sent, still kept" — you can rewrite any of them later; all captions live in the single content file.
- Keep the chat screenshots readable: they'll show fully instead of being cropped square, so no text gets cut off.

## Order I'll use

1. "I love you no matter what" message
2. "I'll love you forever" message
3. "I will always be by your side" messages
4. "I'd never leave you, never forget you" messages
5. "Ur always on my mind" messages
6. "God doesn't pair two hurt individuals…" message
7. The hand on the study notebook
8. The soft anime frame

## Coming later (left ready, nothing broken meanwhile)

- Locked folder file: when you send it, I'll place it inside the 06 · 12 folder as a letter card with the full-screen zoom viewer.
- Music: send the audio file and I'll wire it to the existing mute/play control. It stays off until she taps it — it will never autoplay.

## Technical details

- Upload the 8 images as CDN-hosted assets and reference their pointers from `src/data/config.ts` under `scrapbook.photos`.
- Adjust the scrapbook figure so screenshot-shaped images use `object-contain` with a natural aspect ratio, while photos keep the current cropped print look.
- Verify the section on mobile and desktop widths before finishing.

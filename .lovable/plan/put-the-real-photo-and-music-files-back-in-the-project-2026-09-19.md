# Put the real photo and music files back in the project

Right now the 8 photos and 3 songs are not stored in the project — the project only holds small text pointers to files kept on Lovable's own image servers. That works inside Lovable, but when you host the site somewhere else those addresses don't exist, so nothing loads.

## What I'll do

1. Download all 11 files (8 photos, 3 songs) back from where they're stored now and save them into the project itself, under `src/assets/`.
2. Change the content file so it points straight at those files instead of the pointers.
3. Delete the 11 pointer files so there's nothing left referring to Lovable's servers.
4. Build the site once and check on a phone-sized screen that all 8 photos show and the music still plays.

After this, everything the site needs travels with the code, so it works on any host.

## Worth knowing

- The three songs are about 21 MB in total. They'll now live inside your repository, which makes it heavier but fully self-contained.
- The letters and the personal-message photo still point at `public/assets/...` folders that are empty. Those stay as they are and keep showing the elegant paper placeholders until you send me the files.

## Technical notes

- Fetch each file from its current CDN URL (via the preview origin) into `src/assets/` under its original name: `IMG_3460.jpg`, `IMG_3461.jpg`, `IMG_3462.jpg`, `IMG_3463.jpg`, `IMG_3464.jpg`, `IMG_3465.jpg`, `IMG_3531.jpg`, `IMG_3603.jpeg`, `track-1984aea3.mp3`, `track-3a7af93a.mp3`, `track-e2853fb0.mp3`.
- In `src/data/config.ts`, replace the `*.asset.json` imports with plain asset imports (`import photo01 from "@/assets/IMG_3460.jpg"`), and use the imported string directly for `scrapbook.photos[].src` and `audio.tracks` (drop the `.url` accessor).
- Remove the 11 `src/assets/*.asset.json` pointer files with `rm` (not `lovable-assets delete`, so the CDN copies stay valid for older previews).
- Vite fingerprints and emits these imports at build time, so they work under any hosting path.
- Verify with `bun run build` plus a Playwright pass at 390px: 8 images loaded, 0 broken, audio element present, no console errors.

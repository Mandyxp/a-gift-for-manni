# Manni's Memory Book

Build a mobile-first, static interactive memory and apology web app dedicated to "Manni" (key date: 6 December). 

Aesthetic & Theme:
- Sophisticated soft blush pink, dusty rose, warm cream/ivory, muted burgundy, delicate paper textures, serif headings, elegant stationery feel, mature and heartfelt (no cheesy cartoon hearts, neon colors, or generic Valentine vibes).

Key Architecture:
- 100% static React/TypeScript web app (no database/backend needed).
- Single centralized configuration file (e.g. `src/data/config.ts`) holding all customizable text, dates, quiz questions/answers, word-search grid/words, letters list and image paths, memories timeline, scrapbook photos, India -> USA coordinates/notes, and Easter egg messages so assets and content can be swapped effortlessly without editing UI components.
- Organized folder structure for assets (`public/assets/letters/`, `photos/`, `audio/`, etc.) with clear code comments.

Features & Flow (12-section journey with subtle skip/exit options throughout, respecting her autonomy):
1. Cinematic Opening: "Manni", "6 December", "There are some things I never managed to say properly", gentle paper particles, "Begin" button.
2. Gentle Disclaimer ("Before you continue..."): Emphasizing she owes no reply or forgiveness and can exit anytime.
3. Things I Still Remember: Interactive vertical timeline of memory cards/envelopes (reveal on tap/scroll).
4. Memory Quiz ("How well do you remember?"): Configurable questions only she'd know; gentle "Almost." retries without shame; builds key piece 1.
5. Word Search / Puzzle: Interactive touch-friendly grid with hidden personal words and the hidden phrase "I LOVE YOU MOMMY"; completes key piece 2.
6. 06 · 12 Locked Box / Folder: Cinematic key-insert lock opening animation when completed (or subtle bypass option).
7. Private Letters Folder: Physical-looking stationery folder containing handwritten letter cards (image viewer with pinch/zoom on mobile).
8. "What I Finally Understand": Dedicated genuine accountability section with honest reflections.
9. Scrapbook ("A Few Things I Didn't Want to Forget"): Organic paper-styled photo gallery adaptable to any number of photos.
10. India → USA: Elegant visual distance indicator (night sky / subtle flight arc connecting two glowing points, thoughtful without guilt).
11. Hidden Easter Egg: Discrete clickable detail revealing a tiny personal message.
12. Final Letter & Closing Screen: Quiet, mature conclusion ("For Manni. 6 December. Some things are worth saying properly"), book closing animation, optional non-autoplay background audio toggle.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a5771704-74fd-45c4-b134-dd294b18faf2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

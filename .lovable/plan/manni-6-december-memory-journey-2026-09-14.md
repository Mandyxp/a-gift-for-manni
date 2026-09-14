# Manni — 6 December Memory Journey

## Goal
Build a mobile-first, fully static, single-page experience that feels like a private stationery keepsake: restrained blush, dusty rose, ivory paper, burgundy ink, serif typography, and quiet motion.

## Experience
- Create a cinematic opening for “Manni” and “6 December,” followed by a clear, gentle disclaimer with an always-available exit.
- Build one continuous 12-part journey with a slim progress marker and subtle skip controls.
- Add revealable memory envelopes, a configurable memory quiz with kind retry language, and a touch-friendly word search.
- Turn quiz and puzzle completion into two visual key pieces that open the “06 · 12” keepsake box; also provide a discreet bypass.
- Present private letter scans in a paper folder with a full-screen mobile viewer supporting pan and pinch zoom.
- Include a sincere accountability passage, an organic scrapbook, an India-to-USA night-sky distance scene, a hidden detail, and a final letter with a book-closing ending.
- Add optional user-started background audio with a persistent mute control; audio never autoplays.

## Content & Assets
- Put all editable copy, dates, questions, accepted answers, puzzle grid, letters, photos, timeline entries, map points, audio path, and hidden messages in one typed configuration file.
- Create clearly named public asset folders for letters, photos, audio, and texture assets, with a short replacement guide.
- Use graceful paper-style placeholders whenever personal images or audio have not yet been supplied.

## Visual Direction
- Warm ivory paper base with soft blush surfaces, dusty-rose accents, muted burgundy ink, and subtle fibers/grain.
- Editorial serif display type paired with a quiet, highly legible sans serif for controls.
- Layered paper edges, folds, stamps, ruled lines, restrained shadows, and tactile transitions without hearts or Valentine motifs.
- Motion stays slow and subtle, with reduced-motion support.

## Technical Details
- Keep the app entirely in React and TypeScript with no backend, accounts, or remote data.
- Split the journey into focused UI components while keeping content centralized.
- Implement accessible keyboard/touch controls, focus states, semantic headings, and responsive layouts.
- Add route-specific title, description, Open Graph, and Twitter metadata.
- Verify the complete interaction path and check both desktop and mobile layouts.

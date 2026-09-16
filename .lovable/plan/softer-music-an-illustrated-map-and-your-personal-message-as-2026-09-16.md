# Softer music, an illustrated map, and your personal message as a story

Three changes, all in the existing look and feel: blush pink, dusty rose, cream, muted burgundy, paper textures, serif headings.

## 1. Quieter music

Set the music to play at a gentle level (about a third of full volume) as soon as it starts, and keep that level when a new song is picked. The mute and shuffle buttons stay exactly as they are.

## 2. "Somewhere Between Here and There" — the little world map

Replace the current thin India → USA line with a hand-drawn feeling map section.

- Title "Somewhere Between Here and There", subtitle "Different places. Different skies. A lot of memories in between."
- A stylised twilight map (drawn by hand in code, no Google Maps, works offline) with India on one side and the USA on the other, in dusty rose, burgundy, soft pink, cream, with faint gold highlights.
- A thin glowing curved route that draws itself when she scrolls to it, with a small plane travelling slowly along it.
- She can drag the map around and zoom in a little, with two fingers on a phone. It never spills off the side of the screen.
- Tapping things opens a small paper note, never a full-screen overlay:
  - The plane pauses and shows "Still a long way." then, a moment later, "But distance doesn't erase memories."
  - India: "Where a lot of this story happened." with a tiny heart/star flicker.
  - USA: "Somewhere far away, where life is continuing in a completely different place."
  - Five tiny stars along the route, each a short handwritten thought ("Some memories travel surprisingly far.", "Different time zone.", "Same old memories.", "Some things don't need a map.", plus one more).
- Once she has opened a few of them, a small handwritten line appears underneath: "I guess the weird thing about distance is that it changes where someone is, not everything they meant." and below it, very small: INDIA → USA.
- Stars twinkle softly, markers pulse gently, notes fade in. Nothing flashy, and all motion switches off for anyone who prefers reduced motion.

## 3. Your personal message, told as scenes

A new section near the ending. At first she only sees a quiet card:

- A large tilted photo frame with space for one picture (see below).
- "There's something I want to tell you personally."
- "Some things are easier to say when you finally have enough space to say them properly."
- A button, "There's more…", which smoothly opens the full experience in place, scrolls to its start, and can be closed and reopened later. Nothing is shortened; the full message is all there.

Opened, it unfolds as nine scenes, each with its own character but the same paper-and-ink language:

1. Something I wanted you to hear — quiet cream page, large serif lines revealed as she scrolls, small handwritten margin note "I didn't really know how to say this."
2. If you're comfortable — a folded note she taps to open; inside, the part about having some way to send things sometimes. Framed entirely as her choice.
3. I still do. — almost empty page, "I love you. I still do." breathing on its own, with "And I'm not ashamed of that." handwritten underneath. No hearts.
4. Every version of you — scattered paper scraps ("the happy phases", "the difficult ones", "the changes", "the easy days", "the difficult days") collecting around the main lines.
5. You don't have to — stripped back, generous space, the three lines revealed one at a time. Respectful, not pleading.
6. What I understand now — torn-paper reflection scene with notes in the margins: "listen more", "trust more", "react less", "respect more".
7. I won't ask you to choose me — nearly bare, one sentence at a time.
8. What you became to me — scrapbook again, a photo with handwritten fragments around it.
9. Final moment — everything simplifies: "I don't know what the future looks like.", then the line about a place even as a friend, then "Tu meri jaan aa." on its own, "Te sach dassan…", and finally "Mai ajj vi chaunda haan ke ik hor New Year tere naal dekhaan." No countdown, no fireworks.

Nothing anywhere asks her to come back, forgive, reply, or feel responsible.

### Photo space

The photo slots look like empty photographs in a scrapbook — intentional, never broken. Drop an image at `public/assets/photos/personal-message.jpg` and it appears automatically, slightly tilted with a soft shadow.

### Editing later

Every word of the map and the message lives in the one content file you already edit, including the India and USA coordinates, the star notes, the marker notes, the plane speed, and the button label. Each scene is one entry you can rewrite without touching the design.

## Technical notes

- `src/data/config.ts`: add `distanceMap` (origin/destination with coordinates and marker copy, `stars[]`, plane messages, closing line, `speed`) and `personalMessage` (intro copy, button label, `sections: PersonalMessageSection[]` with `id`, `title`, `text`, `visualType`, optional `image`/`handwrittenNote`). Keep the existing `distance` keys only if still referenced.
- New components under `src/components/manni/`: `DistanceMap.tsx` (inline SVG world shapes, pointer drag + wheel/pinch zoom clamped, `offsetDistance`/stroke-dash animations, note popovers) and `PersonalMessage.tsx` with `MessageIntro`, `MessageScene`, `EnvelopeScene`, `ScrapbookScene`, `PhotoScene`, `MinimalScene`, `FinalMessageScene`.
- `MemoryJourney.tsx`: swap chapter 08's inline markup for `<DistanceMap />`, insert `<PersonalMessage />` before the final letter chapter, reuse `Reveal`/`useReveal` and `ImageWithFallback`.
- Audio: set `audioRef.current.volume = 0.35` in the play effect (and after track change) — no config surface unless you want one.
- New tokens/keyframes in `src/styles.css` for the map (twinkle, route draw, plane path) and scene textures; all collapse under `prefers-reduced-motion`.
- Static only, no backend, no map API. Verified on mobile 390 with Playwright: no horizontal overflow, drag/zoom, plane tap, scene reveals, zero console errors.

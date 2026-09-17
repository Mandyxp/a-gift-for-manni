/**
 * THE ONE FILE TO EDIT
 * Replace the sample copy and /assets paths below without changing any UI code.
 * Keep the word-search grid rectangular and coordinates zero-based.
 */
import photo01 from "@/assets/IMG_3460.jpg.asset.json";
import photo02 from "@/assets/IMG_3464.jpg.asset.json";
import photo03 from "@/assets/IMG_3462.jpg.asset.json";
import photo04 from "@/assets/IMG_3463.jpg.asset.json";
import photo05 from "@/assets/IMG_3461.jpg.asset.json";
import photo06 from "@/assets/IMG_3465.jpg.asset.json";
import photo07 from "@/assets/IMG_3102.jpg.asset.json";
import photo08 from "@/assets/IMG_3531.jpg.asset.json";
import trackA from "@/assets/track-1984aea3.mp3.asset.json";
import trackB from "@/assets/track-3a7af93a.mp3.asset.json";
import trackD from "@/assets/track-e2853fb0.mp3.asset.json";

export type GridCell = [row: number, column: number];

export type WordEntry = {
  /** Internal match key. Also what is shown once the word is found. */
  label: string;
  /** Optional censored display shown in the word list until the word is found. */
  mask?: string;
  /** Optional hint shown under the mask until the word is found. */
  hint?: string;
  cells: GridCell[];
};

export const manniConfig = {
  person: "Manni",
  date: {
    display: "6 December",
    lock: "06 · 12",
  },
  opening: {
    line: "There are some things I never managed to say properly.",
    beginLabel: "Begin",
  },
  disclaimer: {
    title: "Before you continue…",
    body: [
      "You do not owe me a reply, forgiveness, or even the rest of this page.",
      "This is not a request. It is simply an attempt to say some things with the care they deserved the first time.",
    ],
    continueLabel: "I’d like to continue",
    exitLabel: "Leave quietly",
  },
  exit: {
    title: "That is completely okay.",
    body: "Nothing here asks anything of you. This page will still be here, only if you ever want it.",
    returnLabel: "Return to the beginning",
  },
  memories: [
    {
      date: "A small morning",
      title: "The way you made ordinary days feel held",
      text: "I remember the quiet details more than the grand ones—the familiar sounds, the steady rituals, and the way care appeared without asking to be noticed.",
    },
    {
      date: "The long conversations",
      title: "Your patience with all my unfinished thoughts",
      text: "You listened past the words. I did not always understand how rare that was, or how much safety it gave me.",
    },
    {
      date: "Every 6 December",
      title: "A date that gathers meaning",
      text: "Some dates become more than a square on a calendar. This one carries gratitude, memory, and everything I wish I had said more clearly.",
    },
  ],
  quiz: {
    title: "How well do you remember?",
    intro: "A few details that belong only to our story.",
    retry: "Almost. Take your time—there is no score here.",
    questions: [
      {
        prompt: "What did we always call our safest place?",
        answers: ["home", "our home"],
        hint: "“My heart feels like ____ with you.”",
      },
      {
        prompt: "Which month holds our date?",
        answers: ["december", "dec"],
        hint: "The last month of the year.",
      },
      {
        prompt: "What name belongs at the centre of this page?",
        answers: ["manni"],
        hint: "It begins every chapter here.",
      },
    ],
    completion: "The key is yours.",
  },
  wordSearch: {
    title: "Words I kept returning to",
    instructions: "Tap the letters of a hidden word in order. Tap a selected letter again to undo.",
    grid: [
      "ILOVEYOUMOMMY",
      "RDQPASTNLHOKB",
      "MANNIVERWGZCX",
      "QWERTYUIOPASD",
      "HOMEKJHGFDSAQ",
      "ZXCVBNMASDFGH",
      "DECEMBERQWERT",
      "PLMNKOIJBUHVG",
      "CARETYFGHBNJU",
      "ASDFGHJKLQWER",
      "MEMORYZXCVBNM",
      "POIUYTREWQLKA",
      "GENTLEASDFGHJ",
    ],
    words: [
      {
        label: "I LOVE YOU MOMMY",
        mask: "I  L _ _ _   Y _ _   M _ _ _ _",
        hint: "Four words, 13 letters. The three you said back every night — and the name only you called yourself.",
        cells: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],[0,12]],
      },
      { label: "MANNI", cells: [[2,0],[2,1],[2,2],[2,3],[2,4]] },
      { label: "HOME", cells: [[4,0],[4,1],[4,2],[4,3]] },
      { label: "DECEMBER", cells: [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]] },
      { label: "CARE", cells: [[8,0],[8,1],[8,2],[8,3]] },
      { label: "MEMORY", cells: [[10,0],[10,1],[10,2],[10,3],[10,4],[10,5]] },
      { label: "GENTLE", cells: [[12,0],[12,1],[12,2],[12,3],[12,4],[12,5]] },
    ] as WordEntry[],
    completion: "The second half of the key has found you.",
  },
  lockedBox: {
    title: "The 06 · 12 folder",
    lockedText: "Two small pieces, one quiet lock.",
    
    openLabel: "Turn the key",
    openedText: "Some things are kept safe until we are ready to hold them.",
  },
  letters: [
    {
      title: "What I should have said then",
      date: "Letter I",
      image: "/assets/letters/letter-01.jpg",
      fallback: "Manni, I am sorry for the times my silence asked you to carry what I should have named. You deserved honesty, tenderness, and the dignity of being understood.",
    },
    {
      title: "For the distance between us",
      date: "Letter II",
      image: "/assets/letters/letter-02.jpg",
      fallback: "Distance changed the shape of our days, but not the place you have in mine. I wish I had made that clearer in all the ways that mattered.",
    },
    {
      title: "With no expectation",
      date: "Letter III",
      image: "/assets/letters/letter-03.jpg",
      fallback: "This letter is not a door you must walk through. It is only the truth, placed gently where you can choose to leave it or keep it.",
    },
  ],
  accountability: {
    eyebrow: "What I finally understand",
    title: "An apology is not a request for comfort.",
    paragraphs: [
      "I understand now that intention does not erase impact. Even when I did not mean to cause hurt, the hurt was real, and it was mine to acknowledge without explaining it away.",
      "I understand that being sorry means making room for your experience—not rushing you toward mine. It means accepting that forgiveness cannot be earned by the beauty of an apology.",
      "Most of all, I understand that love should feel like respect in practice: in listening, in consistency, in the courage to be accountable before distance makes the lesson obvious.",
    ],
    closing: "I am sorry, Manni. Fully, and without a condition attached.",
  },
  scrapbook: {
    title: "A few things I didn’t want to forget",
    /** `fit: "whole"` shows the full image (best for message screenshots). */
    photos: [
      { src: photo01.url, alt: "A saved message: I love you no matter what", caption: "No matter what — I never took that lightly", fit: "whole" },
      { src: photo02.url, alt: "A saved message about loving forever", caption: "Forever, written without hesitation", fit: "whole" },
      { src: photo03.url, alt: "A saved message about always being by your side", caption: "Always by my side, even in the teasing", fit: "whole" },
      { src: photo04.url, alt: "A saved message: I'd never leave you, never forget you", caption: "Never forgotten. Not for a single day", fit: "whole" },
      { src: photo05.url, alt: "A saved message: you're always on my mind", caption: "Still, and quietly, on my mind", fit: "whole" },
      { src: photo06.url, alt: "A saved message about two hurt people falling in love", caption: "Some things happen for a reason we only see later", fit: "whole" },
      { src: photo07.url, alt: "A hand resting on a page of study notes", caption: "The ordinary hours that mattered more than I said", fit: "whole" },
      { src: photo08.url, alt: "A soft animated frame that reminds me of you", caption: "This one always made me think of you" },
    ],
  },
  distance: {
    title: "India → USA",
    from: { label: "India", coordinates: "20.5937° N, 78.9629° E" },
    to: { label: "USA", coordinates: "37.0902° N, 95.7129° W" },
    note: "The distance is real. So is the care that crosses it—quietly, without asking to be measured.",
  },
  /** The illustrated map. `x`/`y` are percentages on the map canvas, so places can be nudged freely. */
  distanceMap: {
    title: "Somewhere Between Here and There",
    subtitle: "Different places. Different skies. A lot of memories in between.",
    hint: "Drag to move · pinch or scroll to zoom · tap the plane, the places, and the little stars",
    origin: {
      label: "India",
      coordinates: "20.5937° N, 78.9629° E",
      x: 69,
      y: 55,
      note: "Where a lot of this story happened.",
    },
    destination: {
      label: "USA",
      coordinates: "37.0902° N, 95.7129° W",
      x: 19,
      y: 44,
      note: "Somewhere far away, where life is continuing in a completely different place.",
    },
    plane: {
      /** Seconds for one full crossing. Higher is slower. */
      speed: 34,
      messages: ["Still a long way.", "But distance doesn’t erase memories."],
    },
    /** `at` is a position along the route, from 0 (India) to 1 (USA). */
    stars: [
      { at: 0.16, text: "Some memories travel surprisingly far." },
      { at: 0.34, text: "Different time zone." },
      { at: 0.52, text: "Same old memories." },
      { at: 0.7, text: "Some things don’t need a map." },
      { at: 0.86, text: "A different sky, still the same stars." },
    ],
    closing: "I guess the weird thing about distance is that it changes where someone is, not everything they meant.",
    footnote: "India → USA",
  },

  easterEgg: {
    ariaLabel: "A small pressed flower",
    message: "If you found this: I still remember the smallest things.",
  },
  finalLetter: {
    title: "Dear Manni,",
    paragraphs: [
      "I wanted to make a place where the words could be unhurried. No argument, no defence, no expectation—just the truth of what I remember and what I now understand.",
      "Thank you for every kindness I noticed too late, every patience I mistook for permanence, and every ordinary moment that time revealed as a gift.",
      "Whatever you choose to do with these words, I hope life meets you gently. I hope you feel seen, cherished, and free.",
    ],
    signature: "With love, always",
    closing: "For Manni. 6 December. Some things are worth saying properly.",
    closeLabel: "Close the book",
  },
  contact: {
    eyebrow: "When you feel like talking",
    title: "My door is always open",
    note: "No reply is expected—today or ever. But if you ever want to talk, about anything at all, I am one message away. Any hour, either of these.",
    snapchat: { label: "Snapchat", handle: "manraj.xp", url: "https://snapchat.com/add/manraj.xp" },
    instagram: { label: "Instagram", handle: "manraj.xp", url: "https://instagram.com/manraj.xp" },
  },
  audio: {
    /** Hidden playlist — order is shuffled at runtime and titles are never shown. */
    tracks: [trackA.url, trackB.url, trackD.url],
    available: true,
    label: "Background music",
    shuffleLabel: "Play something else",
  },
} as const;

export type ManniConfig = typeof manniConfig;

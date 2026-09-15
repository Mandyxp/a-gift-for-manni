import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Ghost,
  Instagram,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { manniConfig, type GridCell } from "@/data/config";

type ChapterProps = {
  number: string;
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
  id: string;
};

function Chapter({ number, eyebrow, children, className, id }: ChapterProps) {
  return (
    <section id={id} className={cn("chapter relative scroll-mt-12 px-5 py-24 sm:px-8 sm:py-32", className)}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 flex items-center gap-4 text-xs uppercase text-muted-foreground">
          <span className="font-medium">{number}</span>
          <span className="h-px w-10 bg-border" />
          <span>{eyebrow}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function ImageWithFallback({ src, alt, label, className }: { src: string; alt: string; label: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={cn("paper-placeholder grid place-items-center p-8 text-center", className)} role="img" aria-label={alt}>
        <div>
          <Flower2 className="mx-auto mb-5 h-7 w-7 text-accent-foreground/70" strokeWidth={1.25} />
          <p className="font-serif text-xl text-foreground">{label}</p>
          <p className="mt-2 text-xs uppercase text-muted-foreground">Photograph to be placed here</p>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}

export function MemoryJourney() {
  const c = manniConfig;
  const [entered, setEntered] = useState(false);
  const [consented, setConsented] = useState(false);
  const [exited, setExited] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizMessage, setQuizMessage] = useState("");
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [letterIndex, setLetterIndex] = useState<number | null>(null);
  const [letterScale, setLetterScale] = useState(1);
  const [eggOpen, setEggOpen] = useState(false);
  const [bookClosed, setBookClosed] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * manniConfig.audio.tracks.length));
  const audioRef = useRef<HTMLAudioElement>(null);
  const pinchDistanceRef = useRef<number | null>(null);

  const canUnlock = quizComplete && puzzleComplete;
  const currentQuestion = c.quiz.questions[quizIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) void audioRef.current.play().catch(() => setAudioOn(false));
    else audioRef.current.pause();
  }, [audioOn, trackIndex]);

  function pickAnotherTrack() {
    const total = c.audio.tracks.length;
    if (total < 2) return;
    setTrackIndex((current) => {
      let next = current;
      while (next === current) next = Math.floor(Math.random() * total);
      return next;
    });
    setAudioOn(true);
  }

  const cellKey = (cell: GridCell) => `${cell[0]}-${cell[1]}`;
  const foundCellKeys = useMemo(
    () => new Set(c.wordSearch.words.filter((word) => foundWords.includes(word.label)).flatMap((word) => word.cells.map(cellKey))),
    [foundWords, c.wordSearch.words],
  );

  function submitQuiz(event: React.FormEvent) {
    event.preventDefault();
    if (!currentQuestion) return;
    const normalized = quizAnswer.trim().toLowerCase().replace(/[.!?]/g, "");
    if (!currentQuestion.answers.some((answer) => answer === normalized)) {
      setQuizMessage(c.quiz.retry);
      return;
    }
    if (quizIndex === c.quiz.questions.length - 1) {
      setQuizComplete(true);
      setQuizMessage(c.quiz.completion);
    } else {
      setQuizIndex((index) => index + 1);
      setQuizAnswer("");
      setQuizMessage("");
    }
  }

  function toggleCell(cell: GridCell) {
    const key = cellKey(cell);
    const selectedIndex = selectedCells.findIndex((item) => cellKey(item) === key);
    const next = selectedIndex >= 0 ? selectedCells.slice(0, selectedIndex) : [...selectedCells, cell];
    const matched = c.wordSearch.words.find(
      (word) => !foundWords.includes(word.label) && word.cells.length === next.length && word.cells.every((item, i) => cellKey(item) === cellKey(next[i] ?? [-1, -1])),
    );
    const reverseMatched = c.wordSearch.words.find(
      (word) => !foundWords.includes(word.label) && word.cells.length === next.length && [...word.cells].reverse().every((item, i) => cellKey(item) === cellKey(next[i] ?? [-1, -1])),
    );
    const found = matched ?? reverseMatched;
    if (found) {
      const updated = [...foundWords, found.label];
      setFoundWords(updated);
      setSelectedCells([]);
      if (updated.length === c.wordSearch.words.length) setPuzzleComplete(true);
    } else {
      setSelectedCells(next);
    }
  }

  if (exited) {
    return (
      <main className="paper-noise grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-lg animate-fade-in">
          <p className="mb-5 text-xs uppercase text-muted-foreground">06 · 12</p>
          <h1 className="font-serif text-4xl sm:text-5xl">{c.exit.title}</h1>
          <p className="mx-auto mt-7 max-w-md leading-8 text-muted-foreground">{c.exit.body}</p>
          <Button variant="ghost" className="mt-10" onClick={() => { setExited(false); setEntered(false); setConsented(false); }}>
            <RotateCcw /> {c.exit.returnLabel}
          </Button>
        </div>
      </main>
    );
  }

  if (!entered) {
    return (
      <main className="opening-scene paper-noise relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
        <div className="paper-particles" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl animate-fade-in">
          <p className="mb-6 text-xs uppercase text-muted-foreground">{c.date.display}</p>
          <h1 className="font-serif text-7xl leading-none text-primary sm:text-8xl md:text-9xl">{c.person}</h1>
          <div className="mx-auto my-9 h-px w-16 bg-accent-foreground/40" />
          <p className="mx-auto max-w-xl font-serif text-2xl leading-relaxed text-foreground/80 sm:text-3xl">{c.opening.line}</p>
          <Button size="lg" className="mt-12 min-w-36" onClick={() => setEntered(true)}>
            {c.opening.beginLabel} <ArrowDown />
          </Button>
        </div>
        <p className="absolute bottom-7 text-[10px] uppercase text-muted-foreground">A private page · made with care</p>
      </main>
    );
  }

  if (!consented) {
    return (
      <main className="paper-noise grid min-h-screen place-items-center px-5 py-12">
        <article className="letter-sheet relative w-full max-w-2xl animate-scale-in px-7 py-12 sm:px-14 sm:py-16">
          <p className="mb-5 text-xs uppercase text-muted-foreground">A note of care</p>
          <h1 className="font-serif text-4xl sm:text-5xl">{c.disclaimer.title}</h1>
          <div className="mt-8 space-y-5 leading-8 text-muted-foreground">
            {c.disclaimer.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setConsented(true)}>{c.disclaimer.continueLabel}</Button>
            <Button size="lg" variant="ghost" onClick={() => setExited(true)}>{c.disclaimer.exitLabel}</Button>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="paper-noise min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed right-3 top-3 z-40 flex items-center gap-1 rounded-md border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur sm:right-5 sm:top-5">
        {c.audio.available && (
          <Button size="icon" variant="ghost" aria-label={audioOn ? "Mute background music" : "Play background music"} title={c.audio.label} onClick={() => setAudioOn((value) => !value)}>
            {audioOn ? <Volume2 /> : <VolumeX />}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => setExited(true)} className="text-muted-foreground">Exit</Button>
      </div>
      {c.audio.available && <audio ref={audioRef} src={c.audio.src} loop preload="none" />}

      <nav aria-label="Journey progress" className="fixed left-0 top-0 z-30 h-1 w-full bg-secondary">
        <div className="journey-progress h-full bg-accent-foreground" />
      </nav>

      <Chapter id="memories" number="01" eyebrow="Things I still remember" className="pt-32">
        <header className="max-w-2xl">
          <h2 className="font-serif text-5xl leading-tight sm:text-6xl">Things I still remember</h2>
          <p className="mt-5 leading-7 text-muted-foreground">Not a perfect record. Just the pieces that stayed.</p>
        </header>
        <div className="relative mt-16 space-y-8 before:absolute before:bottom-0 before:left-[11px] before:top-2 before:w-px before:bg-border sm:before:left-1/2">
          {c.memories.map((memory, index) => (
            <details key={memory.title} className={cn("memory-envelope group relative ml-9 sm:ml-0 sm:w-[calc(50%-2rem)]", index % 2 ? "sm:ml-auto" : "sm:mr-auto")}>
              <summary className="cursor-pointer list-none p-6 sm:p-8">
                <span className={cn("absolute -left-[34px] top-7 h-3 w-3 rounded-full border-2 border-background bg-accent-foreground sm:left-auto", index % 2 ? "sm:-left-[39px]" : "sm:-right-[39px]")} />
                <p className="text-xs uppercase text-muted-foreground">{memory.date}</p>
                <h3 className="mt-3 font-serif text-2xl leading-snug">{memory.title}</h3>
                <p className="mt-6 text-xs uppercase text-accent-foreground group-open:hidden">Tap to unfold</p>
                <p className="mt-5 hidden border-t border-border pt-5 leading-7 text-muted-foreground group-open:block">{memory.text}</p>
              </summary>
            </details>
          ))}
        </div>
      </Chapter>

      <Chapter id="quiz" number="02" eyebrow="A memory quiz" className="bg-secondary/55">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <header>
            <h2 className="font-serif text-5xl leading-tight">{c.quiz.title}</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{c.quiz.intro}</p>
            <div className="mt-8 flex gap-2" aria-label={`Question ${quizIndex + 1} of ${c.quiz.questions.length}`}>
              {c.quiz.questions.map((_, index) => <span key={index} className={cn("h-1 flex-1 bg-border", index <= quizIndex && "bg-accent-foreground")} />)}
            </div>
          </header>
          <div className="letter-sheet p-7 sm:p-10">
            {quizComplete ? (
              <div className="py-8 text-center animate-scale-in">
                <KeyRound className="mx-auto h-12 w-12 text-accent-foreground" strokeWidth={1.3} />
                <h3 className="mt-6 font-serif text-3xl">{c.quiz.completion}</h3>
                <p className="mt-3 text-sm text-muted-foreground">Key piece I · complete</p>
              </div>
            ) : currentQuestion ? (
              <form onSubmit={submitQuiz}>
                <p className="text-xs uppercase text-muted-foreground">Question {quizIndex + 1}</p>
                <label htmlFor="quiz-answer" className="mt-4 block font-serif text-3xl leading-snug">{currentQuestion.prompt}</label>
                <input id="quiz-answer" value={quizAnswer} onChange={(event) => setQuizAnswer(event.target.value)} className="mt-8 w-full border-b border-input bg-transparent px-1 py-3 text-lg outline-none transition-colors focus:border-primary" autoComplete="off" />
                <p className="mt-3 text-sm text-muted-foreground">{quizMessage || currentQuestion.hint}</p>
                <Button type="submit" className="mt-7">Answer</Button>
              </form>
            ) : null}
          </div>
        </div>
      </Chapter>

      <Chapter id="puzzle" number="03" eyebrow="A puzzle of us">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-5xl leading-tight">{c.wordSearch.title}</h2>
          <p className="mt-5 leading-7 text-muted-foreground">{c.wordSearch.instructions}</p>
        </header>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_16rem] lg:items-start">
          <div className="mx-auto w-full max-w-2xl overflow-x-auto pb-2">
            <div className="word-grid mx-auto grid min-w-[34rem] gap-1 border border-border bg-card p-3 shadow-sm" style={{ gridTemplateColumns: `repeat(${c.wordSearch.grid[0]?.length ?? 13}, minmax(0, 1fr))` }}>
              {c.wordSearch.grid.flatMap((row, rowIndex) => [...row].map((letter, columnIndex) => {
                const key = `${rowIndex}-${columnIndex}`;
                const selected = selectedCells.some((cell) => cellKey(cell) === key);
                const found = foundCellKeys.has(key);
                return (
                  <button key={key} type="button" aria-label={`Letter ${letter}, row ${rowIndex + 1}, column ${columnIndex + 1}`} aria-pressed={selected || found} onClick={() => toggleCell([rowIndex, columnIndex])} className={cn("aspect-square min-h-9 border border-transparent font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected && "bg-primary text-primary-foreground", found && "border-accent-foreground/30 bg-accent text-accent-foreground")}>
                    {letter}
                  </button>
                );
              }))}
            </div>
          </div>
          <aside className="border-l border-border pl-6">
            <p className="text-xs uppercase text-muted-foreground">Words to find</p>
            <ul className="mt-5 space-y-3">
              {c.wordSearch.words.map((word) => {
                const found = foundWords.includes(word.label);
                return (
                  <li key={word.label} className={cn("flex items-start gap-2 font-serif text-lg", found ? "text-accent-foreground line-through" : "text-foreground/60")}>
                    <Check className={cn("mt-1.5 h-4 w-4 shrink-0", !found && "opacity-0")} />
                    <span>
                      {found || !word.mask ? word.label : word.mask}
                      {!found && word.hint && <span className="mt-1 block font-sans text-xs italic leading-5 text-muted-foreground">{word.hint}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            {selectedCells.length > 0 && <Button variant="ghost" size="sm" className="mt-6" onClick={() => setSelectedCells([])}>Clear selection</Button>}
            {puzzleComplete && <p className="mt-7 border-t border-border pt-5 font-serif text-xl text-accent-foreground">{c.wordSearch.completion}</p>}
          </aside>
        </div>
      </Chapter>

      <Chapter id="locked-box" number="04" eyebrow="The keepsake box" className="lock-section text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase text-primary-foreground/60">Private · {c.date.lock}</p>
          <h2 className="mt-5 font-serif text-5xl sm:text-6xl">{c.lockedBox.title}</h2>
          <p className="mt-6 text-primary-foreground/70">{boxOpen ? c.lockedBox.openedText : c.lockedBox.lockedText}</p>
          <div className={cn("keepsake-box mx-auto mt-12 grid h-56 max-w-md place-items-center border border-primary-foreground/20", boxOpen && "is-open")}>
            <div className="box-lid" />
            <div className="relative z-10">
              {boxOpen ? <BookOpen className="h-16 w-16 animate-scale-in" strokeWidth={1} /> : <LockKeyhole className="h-16 w-16" strokeWidth={1} />}
              <p className="mt-4 font-serif text-2xl">{c.date.lock}</p>
            </div>
          </div>
          {!boxOpen && (
            <div className="mt-9 flex flex-col items-center gap-3">
              <Button variant="secondary" size="lg" disabled={!canUnlock} onClick={() => setBoxOpen(true)}><KeyRound /> {c.lockedBox.openLabel}</Button>
              {!canUnlock && <p className="text-xs text-primary-foreground/60">Complete both keepsakes above—or continue without them.</p>}
              <Button variant="ghost" className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setBoxOpen(true)}>{c.lockedBox.bypassLabel}</Button>
            </div>
          )}
        </div>
      </Chapter>

      <Chapter id="letters" number="05" eyebrow="Private letters" className="bg-secondary/55">
        <header className="max-w-2xl">
          <h2 className="font-serif text-5xl leading-tight">Letters I meant to write properly</h2>
          <p className="mt-5 leading-7 text-muted-foreground">Open only what you want. Leave the rest folded.</p>
        </header>
        <div className="folder mt-14 p-5 pt-12 sm:p-10 sm:pt-14">
          <div className="folder-tab">Private · Manni</div>
          <div className="grid gap-5 md:grid-cols-3">
            {c.letters.map((letter, index) => (
              <button key={letter.title} type="button" onClick={() => { setLetterIndex(index); setLetterScale(1); }} className="letter-card group min-h-72 p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <p className="text-xs uppercase text-muted-foreground">{letter.date}</p>
                <h3 className="mt-8 font-serif text-2xl leading-snug">{letter.title}</h3>
                <div className="mt-12 flex items-center justify-between border-t border-border pt-4 text-xs uppercase text-accent-foreground"><span>Open letter</span><BookOpen className="h-4 w-4 transition-transform group-hover:-rotate-6" /></div>
              </button>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter id="understand" number="06" eyebrow={c.accountability.eyebrow}>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase text-accent-foreground">{c.accountability.eyebrow}</p>
          <h2 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">{c.accountability.title}</h2>
          <div className="mt-12 space-y-7 text-lg leading-9 text-foreground/75">
            {c.accountability.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <blockquote className="mt-12 border-l-2 border-accent-foreground pl-6 font-serif text-2xl leading-relaxed">{c.accountability.closing}</blockquote>
        </div>
      </Chapter>

      <Chapter id="scrapbook" number="07" eyebrow="A small scrapbook" className="bg-secondary/55">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-5xl leading-tight">{c.scrapbook.title}</h2>
        </header>
        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {c.scrapbook.photos.map((photo, index) => (
            <figure key={photo.src} className={cn("photo-print mb-6 break-inside-avoid p-3 pb-7", index % 3 === 0 ? "rotate-[-1deg]" : index % 3 === 1 ? "rotate-[1.2deg]" : "rotate-[-0.5deg]")}>
              <ImageWithFallback src={photo.src} alt={photo.alt} label={`Memory ${String(index + 1).padStart(2, "0")}`} className={cn("w-full bg-card", "fit" in photo && photo.fit === "whole" ? "h-auto object-contain" : index % 2 ? "aspect-[4/5] object-cover" : "aspect-square object-cover")} />
              <figcaption className="px-3 pt-5 text-center font-serif text-lg italic text-foreground/75">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Chapter>

      <Chapter id="distance" number="08" eyebrow="Across the distance" className="night-section text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-5xl sm:text-6xl">{c.distance.title}</h2>
          <div className="distance-map relative mx-auto mt-16 h-64 max-w-3xl" aria-label={`A line from ${c.distance.from.label} to ${c.distance.to.label}`}>
            <div className="flight-arc absolute left-[15%] right-[15%] top-12 h-36 rounded-[50%] border-t border-dashed border-primary-foreground/50" />
            <div className="absolute bottom-10 left-[4%] text-left sm:left-[10%]"><span className="glow-point block" /><p className="mt-4 font-serif text-2xl">{c.distance.from.label}</p><p className="mt-1 text-xs text-primary-foreground/50">{c.distance.from.coordinates}</p></div>
            <div className="absolute bottom-10 right-[4%] text-right sm:right-[10%]"><span className="glow-point ml-auto block" /><p className="mt-4 font-serif text-2xl">{c.distance.to.label}</p><p className="mt-1 text-xs text-primary-foreground/50">{c.distance.to.coordinates}</p></div>
          </div>
          <p className="mx-auto mt-8 max-w-xl font-serif text-2xl leading-relaxed text-primary-foreground/80">{c.distance.note}</p>
        </div>
      </Chapter>

      <Chapter id="easter-egg" number="09" eyebrow="A detail in the margin">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-3xl leading-relaxed text-foreground/75">Some memories announce themselves. Others wait quietly in the margins.</p>
          <button type="button" onClick={() => setEggOpen((value) => !value)} aria-label={c.easterEgg.ariaLabel} className="pressed-flower mx-auto mt-14 block p-4 text-accent-foreground transition-transform hover:rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Flower2 className="h-12 w-12" strokeWidth={1} /></button>
          {eggOpen && <p className="mx-auto mt-5 max-w-sm animate-fade-in font-serif text-xl italic text-accent-foreground">{c.easterEgg.message}</p>}
        </div>
      </Chapter>

      <Chapter id="final-letter" number="10" eyebrow="One final letter" className="pb-32 pt-28">
        <div className={cn("book mx-auto max-w-3xl", bookClosed && "book-closed")}>
          <article className="letter-sheet book-page px-7 py-12 sm:px-16 sm:py-20">
            <h2 className="font-serif text-5xl">{c.finalLetter.title}</h2>
            <div className="mt-10 space-y-6 leading-8 text-foreground/75">{c.finalLetter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <p className="mt-12 font-serif text-2xl italic">{c.finalLetter.signature}</p>
            <div className="mt-14 border-t border-border pt-8 text-center">
              <p className="font-serif text-xl text-accent-foreground">{c.finalLetter.closing}</p>
              <Button className="mt-8" onClick={() => setBookClosed(true)}><BookOpen /> {c.finalLetter.closeLabel}</Button>
            </div>
          </article>
          <div className="book-cover grid min-h-[34rem] place-items-center px-8 text-center text-primary-foreground">
            <div>
              <p className="text-xs uppercase text-primary-foreground/60">{c.date.display}</p>
              <p className="mt-8 font-serif text-6xl">{c.person}</p>
              <div className="mx-auto my-8 h-px w-14 bg-primary-foreground/35" />
              <p className="font-serif text-xl text-primary-foreground/75">Some things are worth saying properly.</p>
              <Button variant="secondary" className="mt-10" onClick={() => setBookClosed(false)}>Open once more</Button>
            </div>
          </div>
        </div>
      </Chapter>

      <Chapter id="contact" number="11" eyebrow={c.contact.eyebrow} className="bg-secondary/55 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-5xl leading-tight sm:text-6xl">{c.contact.title}</h2>
          <p className="mx-auto mt-6 max-w-xl leading-8 text-muted-foreground">{c.contact.note}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <a href={c.contact.snapchat.url} target="_blank" rel="noopener noreferrer" aria-label={`Message ${c.contact.snapchat.handle} on ${c.contact.snapchat.label}`} className="letter-card letter-sheet group flex flex-col items-center px-8 py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Ghost className="h-9 w-9 text-accent-foreground transition-transform group-hover:-rotate-6" strokeWidth={1.25} />
              <p className="mt-5 text-xs uppercase text-muted-foreground">{c.contact.snapchat.label}</p>
              <p className="mt-2 font-serif text-2xl">{c.contact.snapchat.handle}</p>
              <span className="mt-6 border-t border-border pt-4 text-xs uppercase text-accent-foreground">Message any time</span>
            </a>
            <a href={c.contact.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Message ${c.contact.instagram.handle} on ${c.contact.instagram.label}`} className="letter-card letter-sheet group flex flex-col items-center px-8 py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Instagram className="h-9 w-9 text-accent-foreground transition-transform group-hover:-rotate-6" strokeWidth={1.25} />
              <p className="mt-5 text-xs uppercase text-muted-foreground">{c.contact.instagram.label}</p>
              <p className="mt-2 font-serif text-2xl">{c.contact.instagram.handle}</p>
              <span className="mt-6 border-t border-border pt-4 text-xs uppercase text-accent-foreground">Message any time</span>
            </a>
          </div>
        </div>
        <footer className="mt-20 text-center text-xs uppercase text-muted-foreground">Made quietly · for {c.person} · {c.date.display}</footer>
      </Chapter>

      {letterIndex !== null && c.letters[letterIndex] && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/90 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={c.letters[letterIndex].title}>
          <div className="absolute right-3 top-3 flex gap-1 rounded-md bg-background/90 p-1">
            <Button size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setLetterScale((scale) => Math.max(1, scale - 0.25))}><ZoomOut /></Button>
            <Button size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setLetterScale((scale) => Math.min(3, scale + 0.25))}><ZoomIn /></Button>
            <Button size="icon" variant="ghost" aria-label="Close letter" onClick={() => setLetterIndex(null)}><X /></Button>
          </div>
          <div
            className="letter-viewer h-[84vh] w-full max-w-3xl overflow-auto overscroll-contain p-4 touch-pan-x touch-pan-y"
            onTouchStart={(event) => {
              if (event.touches.length !== 2) return;
              const first = event.touches[0];
              const second = event.touches[1];
              if (!first || !second) return;
              pinchDistanceRef.current = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
            }}
            onTouchMove={(event) => {
              if (event.touches.length !== 2 || pinchDistanceRef.current === null) return;
              const first = event.touches[0];
              const second = event.touches[1];
              if (!first || !second) return;
              const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
              const ratio = distance / pinchDistanceRef.current;
              setLetterScale((scale) => Math.min(3, Math.max(1, scale * ratio)));
              pinchDistanceRef.current = distance;
            }}
            onTouchEnd={() => { pinchDistanceRef.current = null; }}
          >
            <div className="mx-auto origin-top transition-transform" style={{ transform: `scale(${letterScale})`, width: `${100 / letterScale}%` }}>
              <LetterContent letter={c.letters[letterIndex]} />
            </div>
          </div>
          <div className="absolute bottom-3 flex items-center gap-2 rounded-md bg-background/90 p-1">
            <Button size="icon" variant="ghost" aria-label="Previous letter" disabled={letterIndex === 0} onClick={() => { setLetterIndex((index) => Math.max(0, (index ?? 0) - 1)); setLetterScale(1); }}><ChevronLeft /></Button>
            <span className="px-2 text-xs text-muted-foreground">{letterIndex + 1} / {c.letters.length}</span>
            <Button size="icon" variant="ghost" aria-label="Next letter" disabled={letterIndex === c.letters.length - 1} onClick={() => { setLetterIndex((index) => Math.min(c.letters.length - 1, (index ?? 0) + 1)); setLetterScale(1); }}><ChevronRight /></Button>
          </div>
        </div>
      )}
    </main>
  );
}

function LetterContent({ letter }: { letter: (typeof manniConfig.letters)[number] }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img src={letter.image} alt={letter.title} onError={() => setFailed(true)} className="mx-auto w-full shadow-2xl" />;
  return (
    <article className="letter-sheet mx-auto min-h-[70vh] max-w-2xl px-8 py-14 sm:px-16 sm:py-20">
      <p className="text-xs uppercase text-muted-foreground">{letter.date}</p>
      <h2 className="mt-7 font-serif text-4xl leading-tight">{letter.title}</h2>
      <p className="mt-10 font-serif text-2xl leading-loose italic text-foreground/80">{letter.fallback}</p>
      <p className="mt-16 font-serif text-xl">— with care</p>
    </article>
  );
}

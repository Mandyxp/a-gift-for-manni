import { useState, useRef } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LetterData = {
  title: string;
  date: string;
  image?: string;
  fallback?: string;
  content?: string;
};

interface LetterViewerProps {
  letters: readonly LetterData[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LetterViewer({ letters, currentIndex, onClose, onNavigate }: LetterViewerProps) {
  const [scale, setScale] = useState(1);
  const pinchDistanceRef = useRef<number | null>(null);
  const letter = letters[currentIndex];

  if (!letter) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/90 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={letter.title}>
      <div className="absolute right-3 top-3 flex gap-1 rounded-md bg-background/90 p-1">
        <Button size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setScale((s) => Math.max(1, s - 0.25))}><ZoomOut /></Button>
        <Button size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setScale((s) => Math.min(3, s + 0.25))}><ZoomIn /></Button>
        <Button size="icon" variant="ghost" aria-label="Close letter" onClick={onClose}><X /></Button>
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
          const ratio = distance / (pinchDistanceRef.current || 1);
          setScale((s) => Math.min(3, Math.max(1, s * ratio)));
          pinchDistanceRef.current = distance;
        }}
        onTouchEnd={() => { pinchDistanceRef.current = null; }}
      >
        <div className="mx-auto origin-top transition-transform" style={{ transform: `scale(${scale})`, width: `${100 / scale}%` }}>
          <LetterContent letter={letter} />
        </div>
      </div>

      <div className="absolute bottom-3 flex items-center gap-2 rounded-md bg-background/90 p-1">
        <Button size="icon" variant="ghost" aria-label="Previous letter" disabled={currentIndex === 0} onClick={() => { onNavigate(currentIndex - 1); setScale(1); }}><ChevronLeft /></Button>
        <span className="px-2 text-xs text-muted-foreground">{currentIndex + 1} / {letters.length}</span>
        <Button size="icon" variant="ghost" aria-label="Next letter" disabled={currentIndex === letters.length - 1} onClick={() => { onNavigate(currentIndex + 1); setScale(1); }}><ChevronRight /></Button>
      </div>
    </div>
  );
}

function LetterContent({ letter }: { letter: LetterData }) {
  const [failed, setFailed] = useState(!letter.image);
  
  if (letter.image && !failed) {
    return <img src={letter.image} alt={letter.title} onError={() => setFailed(true)} className="mx-auto w-full shadow-2xl bg-card" />;
  }
  
  return (
    <article className="letter-sheet mx-auto min-h-[70vh] max-w-2xl px-8 py-14 sm:px-16 sm:py-20">
      <p className="text-xs uppercase text-muted-foreground">{letter.date}</p>
      <h2 className="mt-7 font-serif text-4xl leading-tight">{letter.title}</h2>
      <div className="mt-10 font-serif text-2xl leading-loose italic text-foreground/80 space-y-6">
        {letter.content ? (
          <p>{letter.content}</p>
        ) : (
          <p>{letter.fallback}</p>
        )}
      </div>
      <p className="mt-16 font-serif text-xl">— with care</p>
    </article>
  );
}

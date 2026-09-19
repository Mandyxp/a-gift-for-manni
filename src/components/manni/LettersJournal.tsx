import { BookText, Calendar, Quote } from "lucide-react";
import { manniConfig } from "@/data/config";
import { cn } from "@/lib/utils";

interface LettersJournalProps {
  onOpenEntry: (index: number) => void;
}

export function LettersJournal({ onOpenEntry }: LettersJournalProps) {
  const { dailyJournal } = manniConfig;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-16 max-w-2xl">
        <h2 className="font-serif text-5xl leading-tight sm:text-6xl">{dailyJournal.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground italic">
          "{dailyJournal.description}"
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dailyJournal.entries.map((entry, index) => (
          <button
            key={index}
            onClick={() => onOpenEntry(index)}
            className={cn(
              "journal-entry group relative flex flex-col items-start p-8 text-left transition-all duration-500",
              "letter-sheet border-accent/20",
              "hover:-translate-y-1 hover:shadow-xl",
              index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
            )}
          >
            <div className="mb-6 flex w-full items-center justify-between border-b border-accent/10 pb-4">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-foreground/60">
                <Calendar className="h-3 w-3" />
                {entry.date}
              </span>
              {entry.mood && (
                <span className="text-[10px] font-medium uppercase tracking-tighter text-muted-foreground/50">
                  {entry.mood}
                </span>
              )}
            </div>

            <h3 className="mb-4 font-serif text-2xl text-primary">{entry.title}</h3>
            
            <div className="relative overflow-hidden max-h-32 opacity-80">
              <Quote className="absolute -left-1 -top-1 h-6 w-6 rotate-180 opacity-5 text-accent-foreground" />
              <p className="font-serif text-lg leading-relaxed text-foreground/80 pl-2">
                {entry.content}
              </p>
              <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-card to-transparent" />
            </div>

            <div className="mt-8 flex w-full items-center justify-end">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-foreground group-hover:underline">
                Read entry
                <BookText className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

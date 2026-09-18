import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Flower2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { manniConfig } from "@/data/config";

export type PersonalMessageSection = {
  id: string;
  title: string;
  visualType: "intro" | "envelope" | "minimal" | "scrapbook" | "quiet" | "reflection" | "photo" | "final";
  lines?: readonly string[];
  steps?: readonly string[];
  scraps?: readonly string[];
  margins?: readonly string[];
  punjabi?: readonly string[];
  headline?: string;
  handwrittenNote?: string;
  openLabel?: string;
  image?: string;
};

function useSceneReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, shown };
}

function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string | undefined }) {
  const { ref, shown } = useSceneReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("reveal", shown && "is-shown", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function PhotoFrame({ src, label, className }: { src?: string | undefined; label: string; className?: string | undefined }) {
  const [failed, setFailed] = useState(!src);
  return (
    <figure className={cn("photo-print photo-sway p-3 pb-6", className)}>
      {failed || !src ? (
        <div className="paper-placeholder grid aspect-[4/5] place-items-center px-6 text-center" role="img" aria-label={label}>
          <div>
            <Flower2 className="mx-auto mb-4 h-6 w-6 text-accent-foreground/70" strokeWidth={1.25} />
            <p className="font-serif text-lg">{label}</p>
            <p className="mt-2 text-[11px] uppercase text-muted-foreground">An empty frame, waiting</p>
          </div>
        </div>
      ) : (
        <img src={src} alt={label} loading="lazy" onError={() => setFailed(true)} className="aspect-[4/5] w-full bg-card object-cover" />
      )}
      <figcaption className="pt-4 text-center text-[11px] uppercase text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

function Handwritten({ children, className }: { children: React.ReactNode; className?: string | undefined }) {
  return <p className={cn("handwritten text-accent-foreground", className)}>{children}</p>;
}

function IntroScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-cream px-6 py-16 sm:px-14 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {section.lines?.map((line, index) => (
          <Rise key={line} delay={index * 160}>
            <p className={cn("font-serif leading-relaxed", index === 0 ? "text-3xl sm:text-4xl" : "mt-8 text-lg leading-9 text-foreground/75 sm:text-xl")}>{line}</p>
          </Rise>
        ))}
        {section.handwrittenNote && (
          <Rise delay={420}>
            <Handwritten className="mt-10 -rotate-1 text-xl">{section.handwrittenNote}</Handwritten>
          </Rise>
        )}
      </div>
    </div>
  );
}

function EnvelopeScene({ section }: { section: PersonalMessageSection }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="scene scene-rose px-6 py-16 sm:px-14 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{section.title}</p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn("folded-note mx-auto mt-8 flex w-full max-w-md flex-col items-center px-6 py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", open && "is-open")}
        >
          <Mail className="h-8 w-8 text-accent-foreground" strokeWidth={1.2} />
          <span className="mt-4 text-[11px] uppercase text-accent-foreground">{open ? "Fold it back" : (section.openLabel ?? "Open the note")}</span>
        </button>
        {open && (
          <div className="mx-auto mt-8 max-w-xl animate-fade-in space-y-6 text-left">
            {section.lines?.map((line) => (
              <p key={line} className="font-serif text-lg leading-9 text-foreground/80">{line}</p>
            ))}
            {section.handwrittenNote && <Handwritten className="rotate-[-1deg] text-xl">{section.handwrittenNote}</Handwritten>}
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-ivory px-6 py-24 text-center sm:py-36">
      <Rise>
        <p className="mx-auto max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">{section.headline}</p>
      </Rise>
      {section.handwrittenNote && (
        <Rise delay={600}>
          <Handwritten className="mt-12 text-xl sm:text-2xl">{section.handwrittenNote}</Handwritten>
        </Rise>
      )}
      {section.lines?.map((line, index) => (
        <Rise key={line} delay={800 + index * 160}>
          <p className="mx-auto mt-10 max-w-xl leading-9 text-foreground/70">{line}</p>
        </Rise>
      ))}
    </div>
  );
}

function ScrapbookScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-cream px-6 py-16 sm:px-14 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap justify-center gap-3">
          {section.scraps?.map((scrap, index) => (
            <Rise key={scrap} delay={index * 130}>
              <span className={cn("paper-scrap inline-block px-4 py-2 font-serif text-base italic", index % 3 === 0 ? "rotate-[-2deg]" : index % 3 === 1 ? "rotate-[1.6deg]" : "rotate-[-0.6deg]")}>{scrap}</span>
            </Rise>
          ))}
        </div>
        <div className="mt-12 space-y-7">
          {section.lines?.map((line, index) => (
            <Rise key={line} delay={index * 160}>
              <p className="text-lg leading-9 text-foreground/80">{line}</p>
            </Rise>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuietScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-rose px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-2xl">
        {section.steps?.map((step, index) => (
          <Rise key={step} delay={index * 240}>
            <p className="mb-12 font-serif text-2xl leading-relaxed sm:text-3xl">{step}</p>
          </Rise>
        ))}
        {section.lines?.map((line, index) => (
          <Rise key={line} delay={600 + index * 160}>
            <p className="leading-9 text-foreground/70">{line}</p>
          </Rise>
        ))}
      </div>
    </div>
  );
}

function ReflectionScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-torn px-6 py-16 sm:px-14 sm:py-24">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[1fr_11rem] md:items-start">
        <div className="space-y-7">
          {section.lines?.map((line, index) => (
            <Rise key={line} delay={index * 170}>
              <p className="text-lg leading-9 text-foreground/80">{line}</p>
            </Rise>
          ))}
        </div>
        <ul className="flex flex-wrap gap-4 md:flex-col md:border-l md:border-dashed md:border-border md:pl-5">
          {section.margins?.map((margin, index) => (
            <Rise key={margin} delay={300 + index * 140}>
              <li className="list-none">
                <Handwritten className={cn("text-lg", index % 2 ? "rotate-1" : "-rotate-1")}>{margin}</Handwritten>
              </li>
            </Rise>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhotoScene({ section, fallbackImage, photoLabel }: { section: PersonalMessageSection; fallbackImage?: string | undefined; photoLabel: string }) {
  return (
    <div className="scene scene-cream px-6 py-16 sm:px-14 sm:py-24">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <Rise>
          <PhotoFrame src={section.image ?? fallbackImage} label={photoLabel} className="mx-auto max-w-xs rotate-[-1.5deg]" />
        </Rise>
        <div>
          <div className="mb-8 flex flex-wrap gap-3">
            {section.scraps?.map((scrap, index) => (
              <Rise key={scrap} delay={index * 120}>
                <span className={cn("paper-scrap inline-block px-3 py-1.5 font-serif text-sm italic", index % 2 ? "rotate-1" : "-rotate-1")}>{scrap}</span>
              </Rise>
            ))}
          </div>
          <div className="space-y-6">
            {section.lines?.map((line, index) => (
              <Rise key={line} delay={200 + index * 160}>
                <p className="text-lg leading-9 text-foreground/80">{line}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalMessageScene({ section }: { section: PersonalMessageSection }) {
  return (
    <div className="scene scene-final px-6 py-24 text-center sm:py-36">
      <div className="mx-auto max-w-2xl">
        {section.steps?.map((step, index) => (
          <Rise key={step} delay={index * 300}>
            <p className="mb-14 font-serif text-2xl leading-relaxed sm:text-3xl">{step}</p>
          </Rise>
        ))}
        {section.punjabi?.map((line, index) => (
          <Rise key={line} delay={500 + index * 450}>
            <p className={cn("font-serif", index === 0 ? "punjabi-line text-4xl leading-tight sm:text-5xl" : index === 1 ? "mt-12 text-xl italic text-foreground/65" : "mt-10 text-2xl leading-relaxed sm:text-3xl")}>{line}</p>
          </Rise>
        ))}
        {section.lines?.map((line, index) => (
          <Rise key={line} delay={1400 + index * 160}>
            <p className="mx-auto mt-14 max-w-md leading-9 text-foreground/65">{line}</p>
          </Rise>
        ))}
      </div>
    </div>
  );
}

function MessageScene({ section, fallbackImage, photoLabel }: { section: PersonalMessageSection; fallbackImage?: string | undefined; photoLabel: string }) {
  switch (section.visualType) {
    case "envelope":
      return <EnvelopeScene section={section} />;
    case "minimal":
      return <MinimalScene section={section} />;
    case "scrapbook":
      return <ScrapbookScene section={section} />;
    case "quiet":
      return <QuietScene section={section} />;
    case "reflection":
      return <ReflectionScene section={section} />;
    case "photo":
      return <PhotoScene section={section} fallbackImage={fallbackImage} photoLabel={photoLabel} />;
    case "final":
      return <FinalMessageScene section={section} />;
    default:
      return <IntroScene section={section} />;
  }
}

export function PersonalMessage() {
  const c = manniConfig.personalMessage;
  const [open, setOpen] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  const sections = c.sections as unknown as PersonalMessageSection[];

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      window.setTimeout(() => storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <PhotoFrame src={c.photo} label={c.photoLabel} className="mx-auto w-full max-w-xs rotate-[-1.5deg]" />
        <div>
          <p className="text-[11px] uppercase tracking-wide text-accent-foreground">{c.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">{c.title}</h2>
          <p className="mt-6 max-w-lg leading-8 text-muted-foreground">{c.intro}</p>
          <Button size="lg" className="mt-10" onClick={toggle} aria-expanded={open}>
            {open ? <ChevronUp /> : <ChevronDown />} {open ? c.closeLabel : c.openLabel}
          </Button>
        </div>
      </div>

      {open && (
        <div ref={storyRef} className="mt-16 scroll-mt-16 space-y-8 animate-fade-in">
          {sections.map((section) => (
            <MessageScene key={section.id} section={section} fallbackImage={c.photo} photoLabel={c.photoLabel} />
          ))}
          <div className="pt-4 text-center">
            <Button variant="ghost" onClick={toggle}>
              <ChevronUp /> {c.closeLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

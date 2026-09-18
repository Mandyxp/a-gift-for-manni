import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plane, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { manniConfig } from "@/data/config";

const VIEW_W = 1000;
const VIEW_H = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.6;

type Note = { id: string; title?: string; text: string; sub?: string; kind: "place" | "star" | "plane" };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function DistanceMap() {
  const c = manniConfig.distanceMap;

  const from = useMemo(() => ({ x: (c.origin.x / 100) * VIEW_W, y: (c.origin.y / 100) * VIEW_H }), [c.origin.x, c.origin.y]);
  const to = useMemo(() => ({ x: (c.destination.x / 100) * VIEW_W, y: (c.destination.y / 100) * VIEW_H }), [c.destination.x, c.destination.y]);
  const control = useMemo(() => ({ x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - VIEW_H * 0.46 }), [from, to]);

  const pointAt = useCallback(
    (t: number) => {
      const inv = 1 - t;
      return {
        x: inv * inv * from.x + 2 * inv * t * control.x + t * t * to.x,
        y: inv * inv * from.y + 2 * inv * t * control.y + t * t * to.y,
      };
    },
    [from, to, control],
  );

  const routePath = `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [flying, setFlying] = useState(true);
  const [note, setNote] = useState<Note | null>(null);
  const [planeStep, setPlaneStep] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>([]);

  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const pinchRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);

  // reveal on scroll
  useEffect(() => {
    const node = containerRef.current;
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
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // plane travel
  useEffect(() => {
    if (!shown || !flying) return;
    if (prefersReducedMotion()) {
      setProgress(0.5);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setProgress((value) => (value + delta / c.plane.speed) % 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, flying, c.plane.speed]);

  // plane message sequence
  useEffect(() => {
    if (flying || planeStep !== 1) return;
    const timer = window.setTimeout(() => {
      setPlaneStep(2);
      setNote({ id: "plane", kind: "plane", text: c.plane.messages[1] ?? "" });
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [flying, planeStep, c.plane.messages]);

  const discover = useCallback((id: string) => {
    setDiscovered((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const zoomAt = useCallback((nextZoom: number, px: number, py: number) => {
    setZoom((current) => {
      const next = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const k = next / current;
      setOffset((o) => ({ x: px - (px - o.x) * k, y: py - (py - o.y) * k }));
      return next;
    });
  }, []);

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  // non-passive wheel zoom
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = node.getBoundingClientRect();
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1);
      zoomAt(zoomRef.current * Math.exp(-dy * 0.0018), event.clientX - rect.left, event.clientY - rect.top);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pinchRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinchRef.current.size === 2) {
      const [a, b] = [...pinchRef.current.values()];
      if (a && b) pinchStartRef.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomRef.current };
      dragRef.current = null;
      return;
    }
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pinchRef.current.has(event.pointerId)) pinchRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinchRef.current.size === 2 && pinchStartRef.current) {
      const [a, b] = [...pinchRef.current.values()];
      if (!a || !b) return;
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(
        pinchStartRef.current.zoom * (distance / pinchStartRef.current.distance),
        (a.x + b.x) / 2 - rect.left,
        (a.y + b.y) / 2 - rect.top,
      );
      return;
    }
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    dragRef.current = { id: drag.id, x: event.clientX, y: event.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }

  function endPointer(event: React.PointerEvent<HTMLDivElement>) {
    pinchRef.current.delete(event.pointerId);
    if (pinchRef.current.size < 2) pinchStartRef.current = null;
    if (dragRef.current?.id === event.pointerId) dragRef.current = null;
  }

  const planePoint = pointAt(progress);
  const planeNext = pointAt(Math.min(1, progress + 0.01));
  const planeAngle = (Math.atan2(planeNext.y - planePoint.y, planeNext.x - planePoint.x) * 180) / Math.PI;
  const exploredEnough = discovered.length >= 3;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="text-center">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{c.title}</h2>
        <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic text-primary-foreground/70 sm:text-xl">{c.subtitle}</p>
      </header>

      <div className="relative mt-10">
        <div
          ref={containerRef}
          className="map-frame relative h-[19rem] w-full touch-none overflow-hidden sm:h-[26rem]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onPointerLeave={endPointer}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
          >
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" role="img" aria-label={`A small map from ${c.origin.label} to ${c.destination.label}`}>
              <defs>
                <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="var(--color-primary-foreground)" stopOpacity="0.14" />
                </linearGradient>
                <linearGradient id="map-route" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="var(--color-primary-foreground)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* stylised, hand-drawn landmasses — not a real atlas */}
              <g fill="url(#map-land)" stroke="var(--color-primary-foreground)" strokeOpacity="0.2" strokeWidth="1.2">
                <path d="M60 120 q60 -40 130 -18 q52 16 96 -6 q44 -22 70 12 q22 34 -14 62 q-34 26 -46 66 q-14 44 -56 44 q-40 0 -58 -34 q-20 -38 -62 -50 q-46 -14 -60 -44 q-12 -26 0 -32 Z" />
                <path d="M196 300 q34 6 40 40 q6 34 34 62 q26 26 12 44 q-16 20 -44 -6 q-30 -28 -42 -74 q-12 -46 0 -66 Z" />
                <path d="M430 176 q46 -34 106 -22 q44 8 66 -14 q26 -26 44 4 q16 28 -10 52 q-30 26 -70 30 q-52 6 -84 -14 q-34 -22 -52 -36 Z" />
                <path d="M600 150 q80 -46 168 -22 q66 18 108 -8 q40 -24 58 10 q16 34 -30 58 q-52 26 -78 62 q-24 34 -66 22 q-40 -12 -56 -46 q-16 -34 -60 -44 q-46 -12 -44 -32 Z" />
                <path d="M660 250 q40 -8 56 24 q16 30 42 44 q22 14 4 34 q-18 20 -46 -2 q-32 -24 -52 -58 q-18 -32 -4 -42 Z" />
                <path d="M818 356 q44 -22 78 4 q28 20 6 40 q-26 22 -66 8 q-38 -14 -18 -52 Z" />
              </g>

              {/* route */}
              <path d={routePath} fill="none" stroke="url(#map-route)" strokeWidth="2.4" strokeLinecap="round" className={cn("route-line", shown && "is-drawn")} />
            </svg>

            {/* stars along the route */}
            {c.stars.map((star, index) => {
              const point = pointAt(star.at);
              return (
                <button
                  key={star.text}
                  type="button"
                  aria-label={`A small note along the way, ${index + 1}`}
                  className="map-star absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ left: `${(point.x / VIEW_W) * 100}%`, top: `${(point.y / VIEW_H) * 100}%`, animationDelay: `${index * 0.6}s` }}
                  onClick={() => {
                    setNote({ id: star.text, kind: "star", text: star.text });
                    discover(star.text);
                  }}
                >
                  <span className="block h-1.5 w-1.5 bg-primary-foreground" />
                </button>
              );
            })}

            {/* places */}
            {[
              { data: c.origin, id: "origin" },
              { data: c.destination, id: "destination" },
            ].map(({ data, id }) => (
              <button
                key={id}
                type="button"
                aria-label={`${data.label} — ${data.note}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ left: `${data.x}%`, top: `${data.y}%` }}
                onClick={() => {
                  setNote({ id, kind: "place", title: data.label, text: data.note, sub: data.coordinates });
                  discover(id);
                }}
              >
                <span className="glow-point mx-auto block" />
                <span className="mt-2 block font-serif text-sm text-primary-foreground sm:text-base">{data.label}</span>
              </button>
            ))}

            {/* the little plane */}
            <button
              type="button"
              aria-label="The little plane on its way"
              className="absolute -translate-x-1/2 -translate-y-1/2 p-3 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ left: `${(planePoint.x / VIEW_W) * 100}%`, top: `${(planePoint.y / VIEW_H) * 100}%` }}
              onClick={() => {
                if (flying) {
                  setFlying(false);
                  setPlaneStep(1);
                  setNote({ id: "plane", kind: "plane", text: c.plane.messages[0] ?? "" });
                  discover("plane");
                } else {
                  setFlying(true);
                  setPlaneStep(0);
                  setNote(null);
                }
              }}
            >
              <Plane className="h-5 w-5 drop-shadow" strokeWidth={1.5} style={{ transform: `rotate(${planeAngle + 45}deg)` }} />
            </button>
          </div>

          {/* zoom controls */}
          <div className="absolute right-2 top-2 flex flex-col gap-1 rounded-md border border-primary-foreground/20 bg-primary/60 p-1 backdrop-blur">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Zoom in"
              onClick={() => {
                const rect = containerRef.current?.getBoundingClientRect();
                zoomAt(zoom * 1.3, (rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2);
              }}
            >
              <Plus />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Zoom out"
              onClick={() => {
                const rect = containerRef.current?.getBoundingClientRect();
                zoomAt(zoom / 1.3, (rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2);
              }}
            >
              <Minus />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Centre the map"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
            >
              <RotateCcw />
            </Button>
          </div>

          {/* the little paper note */}
          {note && (
            <div className="map-note absolute bottom-3 left-3 right-3 mx-auto max-w-sm p-4 sm:left-4 sm:right-auto sm:w-80">
              <button
                type="button"
                aria-label="Close note"
                onClick={() => setNote(null)}
                className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {note.title && (
                <p className="pr-6 text-xs uppercase tracking-wide text-accent-foreground">
                  {note.title}
                  {note.kind === "place" && <span className="note-spark ml-2">✦</span>}
                </p>
              )}
              <p className={cn("pr-4 font-serif leading-relaxed text-foreground", note.title ? "mt-2 text-lg" : "text-lg italic")}>{note.text}</p>
              {note.sub && <p className="mt-2 text-[11px] uppercase text-muted-foreground">{note.sub}</p>}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] uppercase text-primary-foreground/45">{c.hint}</p>
      </div>

      <div className={cn("reveal mt-12 text-center", exploredEnough && "is-shown")} aria-hidden={!exploredEnough}>
        <p className="mx-auto max-w-2xl font-serif text-xl italic leading-relaxed text-primary-foreground/85 sm:text-2xl">{c.closing}</p>
        <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-primary-foreground/40">{c.footnote}</p>
      </div>
    </div>
  );
}

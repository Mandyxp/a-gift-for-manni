import { createFileRoute } from "@tanstack/react-router";
import { MemoryJourney } from "@/components/manni/MemoryJourney";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For Manni — 6 December" },
      { name: "description", content: "A private collection of memories, letters, and words for Manni." },
      { property: "og:title", content: "For Manni — 6 December" },
      { property: "og:description", content: "A private collection of memories, letters, and words for Manni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MemoryJourney />;
}

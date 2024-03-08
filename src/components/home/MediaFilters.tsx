"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const filters = [
  {
    content: "All",
    type: null,
  },
  {
    content: "Youtube",
    type: "youtube",
  },
  {
    content: "Audio",
    type: "audio",
  },
  {
    content: "Pdf",
    type: "pdf",
  },
  {
    content: "Web",
    type: "web",
  },
  {
    content: "Creations",
    type: "creations",
  },
] as const;

export const MediaFilters = () => {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");

  const params = new URLSearchParams(searchParams);

  const transformURL = (type: (typeof filters)[number]["type"]) => {
    if (type === null) params.delete("type");
    else params.set("type", type);
    return `/dashboard?${params.toString()}`;
  };

  return (
    <div className="space-x-4">
      {filters.map(({ content, type }) => (
        <Link
          key={content}
          className={cn(
            buttonVariants({
              variant: selectedType === type ? "secondary" : "outline",
              size: "sm",
            }),
            "rounded-2xl px-4",
          )}
          href={transformURL(type)}
        >
          {content}
        </Link>
      ))}
    </div>
  );
};

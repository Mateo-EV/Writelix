"use client";

import { FileType } from "@/server/db/schema";
import { type RouterOutputs } from "@/trpc/shared";
import { AudioLinesIcon } from "lucide-react";
import { Icons } from "../Icons";
import { cn, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type MediaSmallProps = {
  media: RouterOutputs["file"]["getAll"][number];
};

const MotionLink = motion(Link);

const MediaContent = {
  [FileType.PDF]: {
    icon: <Icons.pdf className="size-6" />,
  },
  [FileType.AUDIO]: {
    icon: <AudioLinesIcon className="size-6 text-orange-400" />,
  },
  [FileType.WEB]: {
    icon: <Icons.web className="size-6 text-green-500" />,
  },
  [FileType.YOUTUBE]: {
    icon: <Icons.youtube className="size-6" />,
  },
};

export const MediaSmall = ({ media }: MediaSmallProps) => {
  const content = MediaContent[media.type];
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  return (
    <MotionLink
      href={
        "/dashboard/uploads/" + media.id + (searchParams && "?" + searchParams)
      }
      layout
      className={cn(
        "flex animate-fade-in items-center justify-between rounded-md p-1 transition-colors hover:bg-secondary",
        pathname.includes(media.id) && "bg-secondary",
      )}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-muted p-2">{content.icon}</div>
        <p className="text-base">{media.name}</p>
      </div>
      <span className="mr-2 text-xs text-muted-foreground">
        {formatDate(media.createdAt)}
      </span>
    </MotionLink>
  );
};

"use client";

import { useModal } from "@/hooks/useModal";
import { cn, formatDate } from "@/lib/utils";
import { FileType } from "@/server/db/schema";
import { type RouterOutputs } from "@/trpc/shared";
import { motion } from "framer-motion";
import {
  AudioLinesIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icons } from "../Icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";

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
  const { openModal } = useModal();
  const [dropdownOpen, setIsDropdownOpen] = useState(false);

  const href =
    "/dashboard/uploads/" + media.id + (searchParams && "?" + searchParams);

  return (
    <MotionLink
      href={href}
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
        <p className="text-base">
          {media.name}
          <span className="ml-2 text-xs italic text-muted-foreground">
            {formatDate(media.createdAt)}
          </span>
        </p>
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={href}>
              <EyeIcon className="mr-2 size-4" /> <span>View</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(false);
              openModal({
                type: "DeleteUploadModal",
                data: { fileId: media.id },
              });
            }}
          >
            <TrashIcon className="mr-2 size-4" /> <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MotionLink>
  );
};

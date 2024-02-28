"use client";

import {
  AlignLeftIcon,
  CloudIcon,
  HomeIcon,
  MessageCircleIcon,
  NotepadTextIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "../ui/sheet";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Home",
    icon: HomeIcon,
    href: "/dashboard",
  },
  {
    title: "Uploads",
    icon: CloudIcon,
    href: "/dashboard/uploads",
  },
  {
    title: "Summaries",
    icon: NotepadTextIcon,
    href: "/dashboard/summaries",
  },
  {
    title: "Chat",
    icon: MessageCircleIcon,
    href: "/dashboard/chat",
  },
  {
    title: "Create",
    icon: PlusIcon,
    href: "/dashboard/create",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    href: "/dashboard/settings",
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isNotDesktop = useMediaQuery("(max-width: 1024px)");
  const pathname = usePathname();

  const sidebarItemsRender = useMemo(
    () => (
      <div className="mt-6 flex flex-col gap-4">
        {sidebarItems.map(({ title, icon: Icon, href }) => (
          <Link
            href={href}
            className={cn(
              buttonVariants({
                variant: pathname === href ? "default" : "ghost",
              }),
              "justify-start",
            )}
            onClick={() => setIsOpen(false)}
            key={title}
          >
            <Icon className="mr-6" /> {title}
          </Link>
        ))}
      </div>
    ),
    [pathname],
  );

  if (isNotDesktop)
    return (
      <>
        <Button
          className="fixed bottom-4 right-4 rounded-full"
          variant="secondary"
          size="icon"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <AlignLeftIcon className="size-4" />
        </Button>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left">{sidebarItemsRender}</SheetContent>
        </Sheet>
      </>
    );

  return (
    <div className="hidden basis-[250px] border-r px-4 lg:block">
      {sidebarItemsRender}
    </div>
  );
};

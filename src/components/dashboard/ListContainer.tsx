"use client";

import { useMediaQuery } from "@mantine/hooks";
import { usePathname } from "next/navigation";

type ListContainerProps = {
  children: React.ReactNode;
};

export const ListContainer = ({ children }: ListContainerProps) => {
  const pathname = usePathname();
  const isNotLargeDesktop = useMediaQuery("(max-width: 1280px)");

  if (isNotLargeDesktop && !pathname.endsWith("/uploads")) return null;

  return (
    <div className="flex max-h-[calc(100vh-18.5rem)] flex-1 flex-col gap-5 md:max-h-[calc(100vh-15.2rem)]">
      {children}
    </div>
  );
};

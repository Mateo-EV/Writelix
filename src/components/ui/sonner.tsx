"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      // closeButton
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
            "data-[type=error]:group-[.toaster]:bg-destructive data-[type=error]:group-[.toaster]:border-destructive data-[type=error]:group-[.toaster]:text-white",
            "data-[type=success]:group-[.toaster]:bg-green-500 data-[type=success]:group-[.toaster]:border-green-500 data-[type=success]:group-[.toaster]:text-white",
          ),
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

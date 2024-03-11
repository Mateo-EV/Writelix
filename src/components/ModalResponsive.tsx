"use client";

import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";

type ModalResponsiveProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  header?: React.ReactNode;
  contentDialogProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DialogContent>,
    "children"
  >;
  contentDrawerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DrawerContent>,
    "children"
  >;
};

export const ModalResponsive = ({
  children,
  trigger,
  header,
  contentDialogProps,
  contentDrawerProps,
}: ModalResponsiveProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent {...contentDialogProps}>
          {header && <DialogHeader>{header}</DialogHeader>}
          {children}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent {...contentDrawerProps}>
        {header && <DrawerHeader>{header}</DrawerHeader>}
        {children}
      </DrawerContent>
    </Drawer>
  );
};

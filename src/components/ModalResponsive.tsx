"use client";

import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

type ModalResponsiveProps = {
  children: React.ReactNode;
  trigger: React.ReactNode;
};

export const ModalResponsive = ({
  children,
  trigger,
}: ModalResponsiveProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

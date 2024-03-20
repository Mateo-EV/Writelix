"use client";

import { useMediaQuery } from "@mantine/hooks";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { createContext } from "react";

type ModalResponsiveProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  header?: React.ReactNode;
  description?: React.ReactNode;
  contentDialogProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DialogContent>,
    "children"
  >;
  contentDrawerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DrawerContent>,
    "children"
  >;
};

type ModalResponsiveFullControlledProps = React.ComponentPropsWithoutRef<
  typeof Dialog | typeof Drawer
> &
  ModalResponsiveProps;

type ModalResponsiveContextProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalResponsiveContext = createContext<ModalResponsiveContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsOpen: () => {},
});

export const useModalResponsiveContext = () =>
  useContext(ModalResponsiveContext);

export const ModalResponsive = ({
  children,
  trigger,
  header,
  description,
  contentDialogProps,
  contentDrawerProps,
  ...props
}: ModalResponsiveProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent {...contentDialogProps}>
          {header && <DialogHeader>{header}</DialogHeader>}
          {description && <DialogDescription>{description}</DialogDescription>}
          <ModalResponsiveContext.Provider value={{ setIsOpen }}>
            {children}
          </ModalResponsiveContext.Provider>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} {...props}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent {...contentDrawerProps}>
        {header && <DrawerHeader>{header}</DrawerHeader>}
        {description && <DrawerDescription>{description}</DrawerDescription>}
        <ModalResponsiveContext.Provider value={{ setIsOpen }}>
          {children}
        </ModalResponsiveContext.Provider>
      </DrawerContent>
    </Drawer>
  );
};

export const ModalResponsiveFullControlled = ({
  children,
  trigger,
  open,
  onOpenChange,
  header,
  description,
  contentDialogProps,
  contentDrawerProps,
  ...props
}: ModalResponsiveFullControlledProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent {...contentDialogProps}>
          {header && <DialogHeader>{header}</DialogHeader>}
          {description && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...props}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent {...contentDrawerProps}>
        {header && <DrawerHeader>{header}</DrawerHeader>}
        {description && <DrawerDescription>{description}</DrawerDescription>}
        {children}
      </DrawerContent>
    </Drawer>
  );
};

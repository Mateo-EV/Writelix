"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";

export const DashboardContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ScrollArea className="flex-1">
      <motion.div
        className="flex flex-1 flex-col gap-5 p-8"
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </ScrollArea>
  );
};

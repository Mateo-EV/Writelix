"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const DashboardContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn("flex flex-1 flex-col gap-5 px-6 py-8", className)}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

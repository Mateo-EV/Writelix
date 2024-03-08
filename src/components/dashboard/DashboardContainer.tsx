"use client";

import { motion } from "framer-motion";

export const DashboardContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      className="flex flex-1 grid-cols-1 flex-col gap-5 px-6 py-8 xl:grid-cols-2"
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
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

import { cn } from "@/lib/utils";
import { Loader2, type LucideProps } from "lucide-react";

export const LoadingSpinner = ({ className, ...props }: LucideProps) => {
  return (
    <Loader2 className={cn("size-4 animate-spin", className)} {...props} />
  );
};

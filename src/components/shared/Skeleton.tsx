"use client";

import { cn } from "@/lib/utils";
import NativeSkeleton, {
  type SkeletonProps as SkeletonPropsNative,
} from "react-loading-skeleton";

type SkeletonProps = SkeletonPropsNative;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <NativeSkeleton
      {...props}
      className={cn(
        "dark:[--base-color:#313131] dark:[--highlight-color:#525252]",
        className,
      )}
    />
  );
};

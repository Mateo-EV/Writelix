"use client";

import { useTheme } from "next-themes";
import NativeSkeleton, {
  type SkeletonProps as SkeletonPropsNative,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonProps = SkeletonPropsNative;

export const Skeleton = (props: SkeletonProps) => {
  const { theme } = useTheme();

  return (
    <NativeSkeleton
      {...props}
      baseColor={theme === "dark" ? "#313131" : undefined}
      highlightColor={theme === "dark" ? "#525252" : undefined}
    />
  );
};

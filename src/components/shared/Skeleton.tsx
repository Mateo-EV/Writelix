"use client";

import NativeSkeleton, {
  type SkeletonProps as SkeletonPropsNative,
} from "react-loading-skeleton";

type SkeletonProps = SkeletonPropsNative;

export const Skeleton = (props: SkeletonProps) => {
  return (
    <NativeSkeleton
      {...props}
      className="dark:[--base-color:#313131] dark:[--highlight-color:#525252]"
    />
  );
};

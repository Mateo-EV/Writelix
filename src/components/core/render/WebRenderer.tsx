"use client";

type WebRendererProps = {
  url: string;
};

export const WebRenderer = ({ url }: WebRendererProps) => {
  return <iframe src={url} className="size-full" />;
};

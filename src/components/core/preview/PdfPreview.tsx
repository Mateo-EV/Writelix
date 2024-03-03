"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import { LoadingSpinner } from "../../ui/loading-spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PdfPreviewProps = React.ComponentPropsWithoutRef<"canvas"> & {
  url: string;
};

export const PdfPreview = ({ url, ...props }: PdfPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageLoaded = useRef(false);

  const { data: page, isLoading } = useQuery({
    queryKey: ["pdfFromUrl", url],
    queryFn: async () => {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      return await pdf.getPage(1);
    },
  });

  useEffect(() => {
    if (!page || pageLoaded.current) return;

    const scale = 0.5;
    const outputScale = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    page.render({
      canvasContext: context,
      viewport,
      transform,
    });

    pageLoaded.current = true;
  }, [page]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <canvas
        {...props}
        ref={canvasRef}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </>
  );
};

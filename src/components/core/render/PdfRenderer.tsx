"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  RotateCwIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import "simplebar-react/dist/simplebar.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PdfRendererProps = {
  url: string;
};

const PdfFullScreen = ({ url }: PdfRendererProps) => {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button aria-label="fullscreen" variant="ghost" size="icon">
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="block w-full max-w-7xl rounded-none border-0 p-0"
        showCloseButton={false}
      >
        <embed
          type="application/pdf"
          src={url}
          className="h-[calc(100vh-10rem)] w-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export const PdfRenderer = ({ url }: PdfRendererProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { width, ref: pdfContainerRef } = useResizeDetector();
  const { height, ref: scrollbarContainerRef } = useResizeDetector();

  const [numPages, setNumPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const onEnterInputPageNumber = (page: string) => {
    const value = parseInt(page);

    if (Number.isNaN(value) || value <= 0 || value > numPages) return;

    setCurrPage(value);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = currPage.toString();
  }, [currPage]);

  return (
    <div className="flex flex-col">
      <div className="flex h-14 w-full flex-grow-0 items-center justify-between border-b px-2">
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="previous page"
            variant="ghost"
            size="icon"
            disabled={!numPages || currPage <= 1}
            onClick={() => setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              className="h-8 w-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                  onEnterInputPageNumber(e.currentTarget.value);
                }
              }}
              defaultValue={1}
              ref={inputRef}
              onBlur={(e) => onEnterInputPageNumber(e.target.value)}
            />
            <p className="space-x-1 text-sm text-zinc-700">
              <span>/</span>
              <span>{numPages ?? "·"}</span>
            </p>
          </div>

          <Button
            aria-label="next page"
            variant="ghost"
            size="icon"
            disabled={!numPages || currPage >= numPages}
            onClick={() =>
              setCurrPage((prev) => (prev + 1 < numPages ? prev + 1 : numPages))
            }
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <SearchIcon className="h-4 w-4" />
                {scale * 100}%{" "}
                <ChevronDownIcon className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setScale(0.75)}>
                75%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            size="icon"
          >
            <RotateCwIcon className="h-4 w-4" />
          </Button>

          <PdfFullScreen url={url} />
        </div>
      </div>

      <SimpleBar
        className="max-w-full flex-1"
        style={{ maxHeight: height ?? undefined }}
        autoHide={false}
        ref={(ref) => {
          if (ref?.el && !scrollbarContainerRef.current)
            scrollbarContainerRef.current = ref.el;
        }}
      >
        {height && (
          <div ref={pdfContainerRef}>
            <Document
              file={url}
              onLoadError={() =>
                toast.error("Error loading PDF", {
                  description: "Please try again later",
                })
              }
              loading={
                <div className="grid place-items-center">
                  <LoadingSpinner className="my-24 size-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from({ length: numPages }).map((_, b) => (
                <Page
                  className={currPage !== b + 1 ? "hidden" : "animate-fade-in"}
                  pageNumber={b + 1}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + b}
                  loading={
                    <div className="grid place-items-center">
                      <LoadingSpinner className="my-24 size-6 animate-spin" />
                    </div>
                  }
                />
              ))}
            </Document>
          </div>
        )}
      </SimpleBar>
    </div>
  );
};

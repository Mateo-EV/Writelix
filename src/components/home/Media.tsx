import { FileType } from "@/server/db/schema";
import { type RouterOutputs } from "@/trpc/shared";
import Image from "next/image";
import { CanvasPDF } from "../shared/CanvasPDF";
import { Icons } from "../shared/Icons";
import { AudioLinesIcon, HeadphonesIcon, PlayIcon } from "lucide-react";
import { LogoWebsite } from "../shared/LogoWebsite";

type MediaProps = {
  media: RouterOutputs["home"]["getFilesAndDocumentation"][number];
};

export const Media = ({ media }: MediaProps) => {
  if (media.type === FileType.PDF) {
    return (
      <div
        tabIndex={0}
        className="flex cursor-pointer flex-col gap-2 rounded-md bg-primary/20 p-2 outline-none transition ease-in hover:scale-105 hover:bg-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
      >
        <div className="flex items-center px-2">
          <Icons.pdf className="mr-2" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {media.title}
          </span>
        </div>
        <div className="grid flex-1 place-items-center overflow-hidden rounded-md">
          <CanvasPDF
            url={"https://utfs.io/f/" + media.key!}
            className="animate-fade-in duration-700 ease-in"
          />
        </div>
      </div>
    );
  }

  if (media.type === FileType.AUDIO) {
    return (
      <div
        tabIndex={0}
        className="flex cursor-pointer flex-col gap-2 rounded-md bg-primary/20 p-2 outline-none transition ease-in hover:scale-105 hover:bg-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
      >
        <div className="flex items-center px-2">
          <AudioLinesIcon className="mr-2 text-orange-400" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {media.title}
          </span>
        </div>
        <div className="grid flex-1 place-items-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
          <HeadphonesIcon className="size-28 text-gray-400" />
        </div>
      </div>
    );
  }

  if (media.type === FileType.WEB) {
    return (
      <div
        tabIndex={0}
        className="flex cursor-pointer flex-col gap-2 rounded-md bg-primary/20 p-2 outline-none transition ease-in hover:scale-105 hover:bg-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
      >
        <div className="flex items-center px-2">
          <Icons.web className="mr-2 text-green-500" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {media.title}
          </span>
        </div>
        <div className="grid flex-1 place-items-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
          <LogoWebsite
            url={media.key!}
            className="animate-fade-in duration-700 ease-in"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      className="flex cursor-pointer flex-col gap-2 rounded-md bg-primary/20 p-2 outline-none transition ease-in hover:-translate-y-1 hover:scale-105 hover:bg-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center px-2">
        {/* Icon */}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {media.title}
        </span>
      </div>
      <div className="flex-1 overflow-hidden rounded-md">
        <Image
          src="https://images.pexels.com/photos/260907/pexels-photo-260907.jpeg"
          width={300}
          height={300}
          className="size-full object-cover"
          alt="title"
        />
      </div>
    </div>
  );
};

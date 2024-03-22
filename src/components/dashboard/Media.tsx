import { FileType } from "@/server/db/schema";
import { type RouterOutputs } from "@/trpc/shared";
import { AudioLinesIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import { PdfPreview } from "../core/preview/PdfPreview";
import { WebPreview } from "../core/preview/WebPreview";
import { Icons } from "../Icons";
import { YoutubePreview } from "../core/preview/YoutubePreview";
import AudioImage from "@/assets/Audio-Default.jpg";
import CreationImage from "@/assets/Creation-Default.jpg";
import Link from "next/link";

type MediaProps = {
  media: RouterOutputs["home"]["getFilesAndDocumentation"][number];
};

const MediaContent = {
  [FileType.PDF]: {
    icon: <Icons.pdf className="mr-2" />,
    main: (key: string) => (
      <PdfPreview url={key} className="animate-fade-in duration-700 ease-in" />
    ),
  },
  [FileType.AUDIO]: {
    icon: <AudioLinesIcon className="mr-2 size-4 text-orange-400" />,
    main: () => (
      <Image
        src={AudioImage}
        fill
        className="size-full animate-fade-in object-cover duration-700 ease-in"
        alt="audio"
      />
    ),
  },
  [FileType.WEB]: {
    icon: <Icons.web className="mr-2 text-green-500" />,
    main: (key: string) => (
      <WebPreview url={key} className="animate-fade-in duration-700 ease-in" />
    ),
  },
  [FileType.YOUTUBE]: {
    icon: <Icons.youtube className="mr-2" />,
    main: (key: string) => (
      <YoutubePreview keyYoutube={key} className="duration-700 ease-in" />
    ),
  },
  creations: {
    icon: <FileTextIcon className="mr-2 size-4 text-blue-500" />,
    main: () => (
      <Image
        src={CreationImage}
        fill
        className="size-full animate-fade-in object-cover duration-700 ease-in"
        alt="creations"
      />
    ),
  },
};

export const Media = ({ media }: MediaProps) => {
  const content = MediaContent[media.type];

  return (
    <Link
      href={"/dashboard/uploads/" + media.id}
      className="flex cursor-pointer flex-col gap-2 rounded-md border bg-card p-2 outline-none transition ease-in hover:shadow-md"
    >
      <div className="relative grid flex-1 place-items-center overflow-hidden rounded-md">
        {content.main(media.key!)}
      </div>
      <div className="flex items-center">
        {content.icon}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
          {media.title}
        </span>
      </div>
    </Link>
  );
};

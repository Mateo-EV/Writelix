"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { FileType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLinesIcon,
  ChevronLeftIcon,
  CloudIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Icons } from "../Icons";
import { ModalResponsive, useModalResponsiveContext } from "../ModalResponsive";
import { Button, ButtonWithLoading } from "../ui/button";
import { Progress } from "../ui/progress";
import { useForm } from "@/hooks/useForm";
import {
  uploadUrlFileSchemaClient,
  type uploadUrlFileSchemaClientType,
} from "@/schemas";
import { Form, FormController } from "../ui/form";
import { YoutubePreview } from "./preview/YoutubePreview";
import { WebPreview } from "./preview/WebPreview";
import { YOUTUBE_REGEX_URL } from "@/config";

type UploadDropzoneProps = {
  type: FileType.PDF | FileType.AUDIO;
};

const UploadDropzone = ({ type }: UploadDropzoneProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { setIsOpen } = useModalResponsiveContext();

  const router = useRouter();
  const globalApi = api.useUtils();

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    intervalRef.current = interval;
  };

  const { startUpload } = useUploadThing(
    type === FileType.PDF ? "pdfUploader" : "audioUploader",
    {
      onClientUploadComplete: (res) => {
        clearInterval(intervalRef.current);
        setUploadProgress(100);
        setTimeout(() => {
          setIsOpen(false);

          const [response] = res;
          const file = response!.serverData;

          router.push("/dashboard/uploads/" + file.id);
          globalApi.file.getAll.setData(undefined, (prevFiles) => {
            if (!prevFiles) return;

            return [
              { ...file, createdAt: new Date(file.createdAt) },
              ...prevFiles,
            ];
          });

          void globalApi.home.getFilesAndDocumentation.refetch();
        }, 500);
      },
      onUploadError: (err) => {
        clearInterval(intervalRef.current);
        setIsUploading(false);
        toast.error(err.message);
      },
      onBeforeUploadBegin: (files) => {
        setIsUploading(true);
        startSimulatedProgress();

        return files;
      },
    },
  );

  return (
    <Dropzone
      multiple={false}
      maxSize={4000000}
      onDropAccepted={(acceptedFile) => void startUpload(acceptedFile)}
      onDropRejected={() => toast.error("Max size exceeded for upload")}
      accept={
        type === FileType.PDF
          ? {
              "application/pdf": [".pdf"],
            }
          : { "audio/*": [] }
      }
    >
      {({ getRootProps, acceptedFiles }) => (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          key="@uploadDropzone"
          className="m-4 h-[330px] rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
        >
          <div
            className="flex h-full w-full items-center justify-center"
            {...getRootProps()}
          >
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <CloudIcon className="size-6 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="dark:text-zinc-4 text-xs text-zinc-500">
                  {type.toUpperCase()} (up to 4MB)
                </p>
              </div>
              {acceptedFiles?.[0] && (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200 dark:divide-zinc-800 dark:bg-black dark:outline-zinc-800">
                  <div className="grid h-full place-items-center px-3 py-2">
                    {type === FileType.PDF ? (
                      <Icons.pdf className="size-4 text-primary" />
                    ) : (
                      <AudioLinesIcon className="size-4 text-orange-400" />
                    )}
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200 dark:bg-zinc-800"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : undefined
                    }
                  />
                </div>
              )}
            </label>
          </div>
        </motion.div>
      )}
    </Dropzone>
  );
};

type UploadUrlProps = {
  type: FileType.WEB | FileType.YOUTUBE;
};

const UploadUrl = ({ type }: UploadUrlProps) => {
  const form = useForm<uploadUrlFileSchemaClientType>({
    schema: uploadUrlFileSchemaClient,
    defaultValues: { url: "", type, name: "" },
    reValidateMode: "onChange",
  });

  const urlFormState = form.watch("url") as string;

  const globalApi = api.useUtils();
  const router = useRouter();
  const { setIsOpen } = useModalResponsiveContext();

  const { mutate: uploadFile, isLoading } = api.file.uploadUrl.useMutation({
    onSuccess: ({ file }) => {
      setIsOpen(false);
      router.push("/dashboard/uploads/" + file.id);
      globalApi.file.getAll.setData(undefined, (prevFiles) => {
        if (!prevFiles) return;

        return [file, ...prevFiles];
      });
      void globalApi.home.getFilesAndDocumentation.refetch();
    },
  });

  return (
    <motion.div
      className="mt-5 flex gap-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      key="@uploadForm"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ url, name }) =>
            uploadFile({ url: url as string, type, name }),
          )}
          className="flex flex-1 flex-col gap-4"
        >
          <FormController
            control={form.control}
            name="name"
            label="Name"
            inputProps={{
              placeholder: "Enter a custom name",
            }}
          />
          <FormController
            control={form.control}
            name="url"
            label={type === FileType.YOUTUBE ? "Youtube Url" : "Website Url"}
            inputProps={{
              placeholder:
                type === FileType.YOUTUBE
                  ? "https://www.youtube.com/watch?v=jNQXAC9IVRw"
                  : "https://www.example.com",
            }}
          />
          <ButtonWithLoading isLoading={isLoading} type="submit">
            Upload
          </ButtonWithLoading>
        </form>
      </Form>
      <div className="relative grid flex-1 place-items-center overflow-hidden rounded-md p-2">
        {form.formState.isValid ? (
          type === FileType.YOUTUBE ? (
            <YoutubePreview
              keyYoutube={urlFormState.match(YOUTUBE_REGEX_URL)?.[1] ?? ""}
            />
          ) : (
            <WebPreview url={urlFormState} />
          )
        ) : (
          <div className="size-full rounded-md border-4 border-dotted" />
        )}
      </div>
    </motion.div>
  );
};

const uploadModalContent = {
  [FileType.PDF]: <UploadDropzone type={FileType.PDF} />,
  [FileType.AUDIO]: <UploadDropzone type={FileType.AUDIO} />,
  [FileType.WEB]: <UploadUrl type={FileType.WEB} />,
  [FileType.YOUTUBE]: <UploadUrl type={FileType.YOUTUBE} />,
  default: null,
};

export const UploadModal = () => {
  const [uploadType, setUploadType] = useState<FileType>();
  const content = uploadModalContent[uploadType ?? "default"];

  return (
    <ModalResponsive
      trigger={
        <Button size="lg" className="gap-2">
          <UploadCloudIcon /> Upload
        </Button>
      }
      contentDialogProps={{ className: "max-w-4xl h-[400px]" }}
      contentDrawerProps={{ className: "p-4 pt-0" }}
      header={
        !uploadType && (
          <p className="hidden font-semibold text-muted-foreground md:block">
            Choose the file type
          </p>
        )
      }
    >
      {uploadType && (
        <button
          onClick={() => setUploadType(undefined)}
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
      )}
      <AnimatePresence mode="wait">
        {!uploadType && (
          <motion.div
            className="grid auto-rows-[150px] grid-cols-1 gap-2 md:grid-cols-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key="@options"
          >
            <Button
              variant="outline"
              className="h-auto"
              onClick={() => setUploadType(FileType.PDF)}
            >
              <Icons.pdf className="size-10" />
            </Button>
            <Button
              variant="outline"
              className="h-auto"
              onClick={() => setUploadType(FileType.AUDIO)}
            >
              <AudioLinesIcon className="size-10 text-orange-400" />
            </Button>
            <Button
              variant="outline"
              className="h-auto"
              onClick={() => setUploadType(FileType.WEB)}
            >
              <Icons.web className="size-10 text-green-500" />
            </Button>
            <Button
              variant="outline"
              className="h-auto"
              onClick={() => setUploadType(FileType.YOUTUBE)}
            >
              <Icons.youtube className="size-10" />
            </Button>
          </motion.div>
        )}
        {content}
      </AnimatePresence>
    </ModalResponsive>
  );
};

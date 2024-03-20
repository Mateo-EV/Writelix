"use client";

import { useModal } from "@/hooks/useModal";
import { ModalResponsiveFullControlled } from "../ModalResponsive";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const DeleteUploadModal = () => {
  const { type, isOpen, setIsOpen, data } = useModal();
  const isModalOpen = isOpen && type === "DeleteUploadModal";

  const globalApi = api.useUtils();
  const router = useRouter();

  const { mutate: deleteFile } = api.file.deleteByFileId.useMutation({
    onMutate: (fileId) => {
      setIsOpen(false);
      const prevFiles = globalApi.file.getAll.getData();

      globalApi.file.getAll.setData(undefined, (prevFiles) => {
        if (!prevFiles) return;

        const filesUpdated = [...prevFiles];
        const indexFile = filesUpdated.findIndex((file) => file.id === fileId);
        filesUpdated.splice(indexFile, 1);

        return filesUpdated;
      });

      return { prevFiles };
    },
    onError: (_, __, context) => {
      if (context?.prevFiles) {
        globalApi.file.getAll.setData(undefined, context.prevFiles);
      }
    },
    onSuccess: () => {
      void globalApi.home.getFilesAndDocumentation.refetch();
      router.refresh();
    },
  });

  return (
    <ModalResponsiveFullControlled
      open={isModalOpen}
      onOpenChange={setIsOpen}
      header={
        <p className="text-center text-lg font-semibold md:text-left">
          Are you sure you want to delete this upload?
        </p>
      }
      description="This action cannot be undone"
      contentDrawerProps={{ className: "p-4 text-center" }}
    >
      <div className="mt-4 flex justify-between">
        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => deleteFile(data!.fileId)}>
          Delete
        </Button>
      </div>
    </ModalResponsiveFullControlled>
  );
};

export default DeleteUploadModal;

import { UploadCloudIcon } from "lucide-react";
import { ModalResponsive } from "../ModalResponsive";
import { Button } from "../ui/button";

export const UploadModal = () => {
  return (
    <ModalResponsive
      trigger={
        <Button size="lg" className="gap-2">
          <UploadCloudIcon /> Upload
        </Button>
      }
    >
      Upload file
    </ModalResponsive>
  );
};

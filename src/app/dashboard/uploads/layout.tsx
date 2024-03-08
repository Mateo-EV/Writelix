import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ListContainer } from "@/components/dashboard/ListContainer";
import { SearchBarNoDelay } from "@/components/dashboard/SearchBar";
import { UploadList } from "@/components/dashboard/UploadList";
import { Button } from "@/components/ui/button";
import { UploadCloudIcon } from "lucide-react";

export default function UploadsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading="Uploads"
        text="Easily upload a youtube video URL, audios, and pdf to chat or generate documentation"
      >
        <Button size="lg" className="gap-2">
          <UploadCloudIcon /> Upload
        </Button>
      </DashboardHeader>
      <div className="flex flex-1 flex-col gap-5 lg:flex-row">
        <ListContainer>
          <SearchBarNoDelay placeholder="Search files..." />
          <UploadList />
        </ListContainer>
        {children}
      </div>
    </DashboardContainer>
  );
}

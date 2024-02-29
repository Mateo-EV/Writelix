import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilesList } from "@/components/home/FilesList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const filters = ["All", "Video", "Audio", "Pdf", "Creations"];

export const metadata = {
  title: "Dashboard",
};

export default function DasboardPage() {
  return (
    <DashboardContainer>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome, what're the plans for today?"
      />
      <div className="space-x-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={filter === "All" ? "secondary" : "outline"}
            size="sm"
            className="rounded-2xl px-4"
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <Input
          className="h-12 border-0 bg-primary/20 pl-11 text-base placeholder:text-muted-foreground/80 dark:bg-primary/20"
          placeholder="Search media"
        />
      </div>
      <FilesList />
    </DashboardContainer>
  );
}

import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MediaFilters } from "@/components/home/MediaFilters";
import { MediaList } from "@/components/home/MediaList";
import { MediaSearch } from "@/components/home/MediaSearch";
import { SearchIcon } from "lucide-react";

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
        <MediaFilters />
      </div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <MediaSearch />
      </div>
      <MediaList />
    </DashboardContainer>
  );
}

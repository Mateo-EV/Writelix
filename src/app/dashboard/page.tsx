import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { MediaFilters } from "@/components/home/MediaFilters";
import { MediaList } from "@/components/home/MediaList";

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

      <MediaFilters />
      <SearchBar placeholder="Search media..." />
      <MediaList />
    </DashboardContainer>
  );
}

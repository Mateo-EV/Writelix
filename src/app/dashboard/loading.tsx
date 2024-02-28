import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="grid flex-1 place-items-center">
      <LoadingSpinner className="size-16" />
    </div>
  );
}

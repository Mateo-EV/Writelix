import { Sidebar } from "@/components/layout/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden lg:container lg:px-4">
      <Sidebar />
      {/* <ScrollArea> */}
      {children}
      {/* </ScrollArea> */}
    </div>
  );
}

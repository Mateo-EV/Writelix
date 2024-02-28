import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex h-[calc(100vh-4rem)] overflow-hidden px-4">
      <Sidebar />
      {children}
    </div>
  );
}

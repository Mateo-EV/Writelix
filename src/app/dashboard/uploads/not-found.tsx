import { Card } from "@/components/ui/card";

export default function UploadsNotFoundPage() {
  return (
    <Card className="hidden flex-1 p-4 lg:block">
      <div className="grid size-full place-items-center rounded-md border-4 border-dotted">
        <p className="px-2 text-center text-xl text-muted-foreground">
          This file doesn&apos;t exists
        </p>
      </div>
    </Card>
  );
}

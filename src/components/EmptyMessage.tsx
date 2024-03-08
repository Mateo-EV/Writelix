import { GhostIcon } from "lucide-react";

export const EmptyMessage = () => {
  return (
    <div className="mt-16 flex flex-col items-center gap-2">
      <GhostIcon className="h-8 w-8 text-zinc-800" />
      <h3 className="text-xl font-semibold">Pretty empty around here</h3>
      <p>Let&apos;s upload something new</p>
    </div>
  );
};

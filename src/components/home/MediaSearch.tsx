"use client";

import { useDebounceCallback } from "@mantine/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Input } from "../ui/input";

export const MediaSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refInput = useRef<HTMLInputElement>(null);

  const handleSearch = useDebounceCallback(() => {
    if (!refInput.current) return;
    const term = refInput.current.value;
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    router.replace(`/dashboard?${params.toString()}`);
  }, 500);

  return (
    <Input
      className="h-12 pl-11"
      placeholder="Search media"
      onChange={() => handleSearch()}
      ref={refInput}
      defaultValue={searchParams.get("search") ?? undefined}
    />
  );
};

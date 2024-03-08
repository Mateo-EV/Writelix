"use client";

import { SearchIcon } from "lucide-react";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";

import { useDebounceCallback } from "@mantine/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";
import { cn } from "@/lib/utils";

type SearchBarProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className"
> & {
  containerClassName?: string;
};

export const SearchBar = ({ containerClassName, ...props }: SearchBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refInput = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isPending) setIsSearching(false);
  }, [isPending]);

  const replaceUrl = useDebounceCallback(() => {
    if (!refInput.current) return;
    const term = refInput.current.value;
    const params = new URLSearchParams(searchParams);
    if (term) params.set("search", term);
    else params.delete("search");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 500);

  const handleSearch = () => {
    setIsSearching(true);
    replaceUrl();
  };

  return (
    <div className={cn("relative", containerClassName)}>
      {isSearching ? (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 ">
          <LoadingSpinner className="size-6 text-primary" />
        </div>
      ) : (
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
      )}
      <Input
        className="h-12 pl-11"
        onChange={handleSearch}
        ref={refInput}
        defaultValue={searchParams.get("search") ?? undefined}
        {...props}
      />
    </div>
  );
};

export const SearchBarNoDelay = ({
  containerClassName,
  ...props
}: SearchBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refInput = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const replaceUrl = useDebounceCallback(() => {
    if (!refInput.current) return;

    const term = refInput.current.value;
    const params = new URLSearchParams(searchParams);

    if (term) params.set("search", term);
    else params.delete("search");

    router.replace(`${pathname}?${params.toString()}`);
  }, 200);

  return (
    <div className={cn("relative", containerClassName)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
      <Input
        className="h-12 pl-11"
        onChange={() => replaceUrl()}
        ref={refInput}
        defaultValue={searchParams.get("search") ?? undefined}
        {...props}
      />
    </div>
  );
};

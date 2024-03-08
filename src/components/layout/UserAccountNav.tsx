"use client";

import { type User } from "@/server/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAvatar } from "../UserAvatar";
import { CreditCard, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";

type UserAccountNavProps = React.ComponentPropsWithoutRef<"div"> & {
  user: Pick<User, "name" | "image" | "email">;
};

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <LayoutDashboard className="size-4" />
            <p className="text-sm">Dashboard</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/billing"
            className="flex items-center space-x-2.5"
          >
            <CreditCard className="size-4" />
            <p className="text-sm">Billing</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-2.5"
          >
            <Settings className="size-4" />
            <p className="text-sm">Settings</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogOutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const LogOutDropdownItem = () => {
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={(event) => {
        event.preventDefault();
        setIsSignOutLoading(true);
        void signOut();
      }}
    >
      <div className="flex items-center space-x-2.5">
        {isSignOutLoading ? <LoadingSpinner /> : <LogOut className="size-4" />}
        <p className="text-sm">Log out</p>
      </div>
    </DropdownMenuItem>
  );
};

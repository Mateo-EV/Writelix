import Link from "next/link";

import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { Suspense } from "react";
import { ModeToggle } from "../ModeToggle";
import { Skeleton } from "../ui/skeleton";
import { UserAccountNav } from "./UserAccountNav";

type NavbarProps = {
  hasMaxWidth?: boolean;
};

export const Navbar = ({ hasMaxWidth = false }: NavbarProps) => {
  return (
    <header className="sticky top-0 flex h-16 w-full justify-center border-b border-gray-200 bg-background/60 backdrop-blur-xl dark:border-gray-700">
      <div
        className={`flex items-center justify-between py-4 ${hasMaxWidth ? "container" : "w-full px-4"}`}
      >
        <div className="flex gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-md px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex"
          >
            <Icons.logo />
            <span className="text-xl font-bold sm:inline-block">WriteLix</span>
          </Link>
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <Suspense
            fallback={
              <Skeleton
                circle
                containerClassName="size-8 block"
                className="h-full"
              />
            }
          >
            <NavbarUserAccount />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

const NavbarUserAccount = async () => {
  const currentUser = await getSession();

  if (currentUser) return <UserAccountNav user={currentUser.user} />;

  return (
    <Link href="/login" className={buttonVariants()}>
      Login
    </Link>
  );
};

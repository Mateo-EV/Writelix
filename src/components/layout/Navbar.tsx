import Link from "next/link";

import { Icons } from "@/components/shared/Icons";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = () => {
  const user = false;

  return (
    <header className="sticky top-0 flex h-16 w-full justify-center border-b border-gray-200 bg-background/60 backdrop-blur-xl dark:border-gray-700">
      <div className="container flex items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-md px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex"
          >
            <Icons.logo />
            <span className="text-xl font-bold sm:inline-block">WriteLix</span>
          </Link>
        </div>
        {user ? null : (
          <Link href="/login" className={buttonVariants()}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

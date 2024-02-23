"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Icons } from "../shared/Icons";
import { signIn } from "next-auth/react";
import { LoadingSpinner } from "../ui/loading-spinner";

export const AuthProviders = () => {
  const [isLoading, setisLoading] = useState(false);

  const handleClick = () => {
    setisLoading(true);
    void signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        className="flex w-full items-center bg-white hover:bg-white/90"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner className="mr-2" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
};

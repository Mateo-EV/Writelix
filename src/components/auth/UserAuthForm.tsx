"use client";

import React from "react";
import { Icons } from "../shared/Icons";
import { usePathname } from "next/navigation";
import { CredentialsForm } from "./CredentialsForm";
import { AuthProviders } from "./AuthProviders";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const UserAuthForm = () => {
  const isRegisterPage = usePathname() === "/register";

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-6 py-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto mb-4 h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {isRegisterPage ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to {isRegisterPage ? "create" : "login to"}{" "}
          your account
        </p>
      </div>
      <CredentialsForm isRegisterPage={isRegisterPage} />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href={isRegisterPage ? "/login" : "/register"}
          className={buttonVariants({
            variant: "link",
            size: "sm",
            className: "h-auto",
          })}
        >
          {isRegisterPage
            ? "Already have an account? Log in"
            : "Don't have an account? Register"}
        </Link>
      </p>
      <AuthProviders />
    </div>
  );
};

export default UserAuthForm;

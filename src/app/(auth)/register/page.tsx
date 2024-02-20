import { Icons } from "@/components/shared/Icons";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <div className="order-1 flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto mb-4 h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to create your account
        </p>
      </div>
      <p className="order-3 px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Already have an account? Log in
        </Link>
      </p>
    </>
  );
}

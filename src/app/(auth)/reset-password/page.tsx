import { ResetForm } from "@/components/auth/ResetForm";
import { Icons } from "@/components/shared/Icons";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-6 py-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto mb-4 h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>
      <ResetForm />
    </div>
  );
}

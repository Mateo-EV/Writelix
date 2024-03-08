import { NewPasswordResetForm } from "@/components/auth/NewPasswordResetForm";
import { Icons } from "@/components/Icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ResetPasswordTokenPage({
  params: { token },
}: {
  params: { token: string };
}) {
  const passwordReset = await getPasswordResetTokenByToken(token);
  if (!passwordReset) return redirect("/");

  const hasExpired = passwordReset.expires < new Date();

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-6 py-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto mb-4 h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your Password
        </h1>
        <p className="text-sm text-muted-foreground">Enter your new password</p>

        {hasExpired && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Token has expired</AlertDescription>
          </Alert>
        )}
      </div>
      {!hasExpired && <NewPasswordResetForm passwordResetToken={token} />}
    </div>
  );
}

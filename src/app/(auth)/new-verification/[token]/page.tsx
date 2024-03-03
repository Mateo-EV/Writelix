import { Icons } from "@/components/shared/Icons";
import { AlertMessage } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getVerificationTokenByToken,
  verifyEmail,
} from "@/data/verificationToken";
import { type VerificationToken } from "@/server/db/schema";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function NewVerificationPage({
  params: { token },
}: {
  params: { token: string };
}) {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) return redirect("/");

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-2 py-4 text-center sm:w-[350px]">
      <Icons.logo className="mx-auto mb-4 h-20 w-20" />
      <h1 className="text-2xl font-semibold tracking-tight">
        Confirming your verification
      </h1>
      <p className="text-sm text-muted-foreground">
        This won&apos;t take long...
      </p>
      <Suspense
        fallback={<LoadingSpinner className="mt-4 h-10 w-10 text-primary" />}
      >
        <EmailVerified verificationToken={verificationToken} />
      </Suspense>
    </div>
  );
}

const EmailVerified = async ({
  verificationToken,
}: {
  verificationToken: VerificationToken;
}) => {
  const { message, status } = await verifyEmail(verificationToken);

  return (
    <AlertMessage
      className="mt-4"
      type={status === "error" ? "destructive" : "success"}
      title={status === "error" ? "Error" : "Success"}
      description={message}
    />
  );
};

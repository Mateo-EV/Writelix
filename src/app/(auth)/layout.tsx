import { AuthForm } from "@/components/AuthForm";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container grid place-items-center">
      <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <AuthForm />
        {children}
      </div>
    </div>
  );
}

import UserAuthForm from "@/components/auth/UserAuthForm";

export default function AuthFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserAuthForm />
      {children}
    </>
  );
}

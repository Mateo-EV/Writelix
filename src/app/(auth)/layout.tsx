export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container grid h-[calc(100vh-4rem)] place-items-center">
      {children}
    </div>
  );
}

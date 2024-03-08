type DashboardHeaderProps = {
  heading: string;
  text?: string;
  children?: React.ReactNode;
};

export const DashboardHeader = ({
  heading,
  text,
  children,
}: DashboardHeaderProps) => (
  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center md:gap-8">
    <div className="grid gap-1">
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-lg text-muted-foreground">{text}</p>}
    </div>
    {children}
  </div>
);

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success:
          "bg-green-500/10 text-green-500 [&>svg]:text-green-500 border-green-500/50",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

type AlertMessageProps = React.ComponentPropsWithoutRef<"div"> & {
  type: VariantProps<typeof alertVariants>["variant"];
  title?: string;
  description?: string;
};

const AlertMessage = ({
  type,
  title,
  description,
  ...props
}: AlertMessageProps) => {
  return (
    <Alert variant={type} {...props}>
      {type === "destructive" && <AlertCircle className="h-4 w-4" />}
      {type === "success" && <Check className="h-4 w-4" />}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && (
        <AlertDescription>
          <p>{description}</p>
        </AlertDescription>
      )}
    </Alert>
  );
};

export { Alert, AlertTitle, AlertDescription, AlertMessage };

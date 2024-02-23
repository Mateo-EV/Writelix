"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  loginUserSchema,
  registerUserSchema,
  type loginUserSchemaType,
  type registerUserSchemaType,
} from "@/schemas";
import { api } from "@/trpc/react";

import { useForm } from "@/hooks/useForm";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ButtonWithLoading } from "../ui/button";

type CredentiaslFormProps = {
  isRegisterPage: boolean;
};

export const CredentialsForm = ({ isRegisterPage }: CredentiaslFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked";

  const form = useForm<loginUserSchemaType | registerUserSchemaType>({
    schema: isRegisterPage ? registerUserSchema : loginUserSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: login } = api.auth.login.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const { mutateAsync: register } = api.auth.register.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push("/login");
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });

  const onSubmit = async (
    values: loginUserSchemaType | registerUserSchemaType,
  ) => {
    if (isRegisterPage) await register({ ...values } as registerUserSchemaType);
    else
      await login({
        email: values.email,
        password: values.password,
      });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {urlError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />

              <AlertTitle>Account Not Linked</AlertTitle>
              <AlertDescription>
                <p>Email already in use by another account</p>
              </AlertDescription>
            </Alert>
          )}
          {isRegisterPage && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <FormInput placeholder="Matthew" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="**********"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonWithLoading
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            {isRegisterPage ? "Register" : "Login"}
          </ButtonWithLoading>
        </div>
      </form>
    </Form>
  );
};

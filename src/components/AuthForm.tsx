import {
  loginUserSchema,
  registerUserSchema,
  type loginUserSchemaType,
  type registerUserSchemaType,
} from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonWithLoading } from "./ui/button";
import { useForm } from "@/hooks/useForm";

export const AuthForm = () => {
  const isRegisterPage = usePathname() === "/register";
  const router = useRouter();

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
    onError: () => {
      toast.error("Failed to login");
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
      <form className="order-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {isRegisterPage && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="Matthew"
                      type="Name"
                      className="border-gray-200 bg-white"
                      {...field}
                    />
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
                    className="border-gray-200 bg-white"
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
                    className="border-gray-200 bg-white"
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

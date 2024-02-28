"use client";

import { useForm } from "@/hooks/useForm";
import {
  createNewPasswordClientSchema,
  type createNewPasswordClientSchemaType,
} from "@/schemas";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type NewPasswordResetFormProps = {
  passwordResetToken: string;
};

export const NewPasswordResetForm = ({
  passwordResetToken,
}: NewPasswordResetFormProps) => {
  const form = useForm<createNewPasswordClientSchemaType>({
    schema: createNewPasswordClientSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const { mutate: createNewPassword, isLoading } =
    api.auth.createNewPassword.useMutation({
      onSuccess: () => {
        router.push("/login");
      },
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ confirmPassword, password }) =>
          createNewPassword({
            confirmPassword,
            password,
            token: passwordResetToken,
          }),
        )}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <FormInput type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <FormInput type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonWithLoading isLoading={isLoading} type="submit">
          Reset Password
        </ButtonWithLoading>
      </form>
    </Form>
  );
};

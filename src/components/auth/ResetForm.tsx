"use client";

import { useForm } from "@/hooks/useForm";
import { resetPasswordSchema, type resetPasswordSchemaType } from "@/schemas";
import { api } from "@/trpc/react";
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

export const ResetForm = () => {
  const form = useForm<resetPasswordSchemaType>({
    schema: resetPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const { mutate: sendResetPasswordLink, isLoading } =
    api.auth.resetPassword.useMutation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((email) => sendResetPasswordLink(email))}
        className="flex flex-col gap-4"
      >
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

        <ButtonWithLoading isLoading={isLoading} type="submit">
          Send
        </ButtonWithLoading>
      </form>
    </Form>
  );
};

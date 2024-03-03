"use client";

import { useForm } from "@/hooks/useForm";
import { editProfileByIdSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "./ui/button";
import { Form, FormController } from "./ui/form";

type ProfileFormProps = {
  name: string;
};

export const ProfileForm = ({ name }: ProfileFormProps) => {
  const form = useForm({
    schema: editProfileByIdSchema,
    defaultValues: { name },
  });
  const router = useRouter();

  const { mutate: editProfile, isLoading } =
    api.profile.editProfileById.useMutation({
      onSuccess: () => {
        router.refresh();
        form.reset({ name: form.getValues().name });
      },
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => editProfile(data))}
        className="flex flex-col gap-4"
      >
        <FormController
          control={form.control}
          name="name"
          label="Name"
          inputProps={{
            placeholder: "Matthew",
          }}
        />
        <ButtonWithLoading
          isLoading={isLoading}
          disabled={!form.formState.isDirty}
          className="w-full self-end sm:w-min"
          type="submit"
        >
          Save
        </ButtonWithLoading>
      </form>
    </Form>
  );
};

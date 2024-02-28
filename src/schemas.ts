import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type loginUserSchemaType = z.infer<typeof loginUserSchema>;

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type registerUserSchemaType = z.infer<typeof registerUserSchema>;

export const resetPasswordSchema = z.object({
  email: z.string(),
});

export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const createNewPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  token: z.string(),
});

export const createNewPasswordClientSchema = createNewPasswordSchema
  .omit({ token: true })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type createNewPasswordClientSchemaType = z.infer<
  typeof createNewPasswordClientSchema
>;

export const editProfileByIdSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

export type editProfileByIdSchemaType = z.infer<typeof editProfileByIdSchema>;

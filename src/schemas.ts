import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type loginUserSchemaType = z.infer<typeof loginUserSchema>;

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type registerUserSchemaType = z.infer<typeof registerUserSchema>;

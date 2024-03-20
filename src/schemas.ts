import { z } from "zod";
import { FileType } from "./server/db/schema";
import { YOUTUBE_REGEX_URL } from "./config";

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

export const uploadUrlFileSchema = z.object({
  type: z.enum([FileType.WEB, FileType.YOUTUBE]),
  url: z.string().min(1, "Url is required"),
  name: z.string().min(1, "Name is required").max(255),
});

export const uploadUrlFileSchemaClient = uploadUrlFileSchema
  .transform(({ url, type, name }) => {
    let formattedUrl: string | false = url;
    if (type === FileType.YOUTUBE) {
      const youtubeUrlMatch = url.match(YOUTUBE_REGEX_URL);

      if (youtubeUrlMatch) formattedUrl = youtubeUrlMatch[1]!;
      else formattedUrl = false;
    }
    console.log(formattedUrl);
    return { url: formattedUrl, type, name };
  })
  .refine(
    ({ type, url }) => {
      if (typeof url !== "string") return false;

      if (type === FileType.WEB) return z.string().url().safeParse(url).success;

      return true;
    },
    ({ type }) => ({ message: `Invalid ${type} url`, path: ["url"] }),
  );
// .refine(
//   ({ type, url }) => {
//     if (type === FileType.YOUTUBE) return url.match(YOUTUBE_REGEX_URL);

//     return z.string().url().safeParse(url).success;
//   },
//   ({ type }) => ({ message: `Invalid ${type} url`, path: ["url"] }),
// );

export type uploadUrlFileSchemaClientType = z.infer<
  typeof uploadUrlFileSchemaClient
>;

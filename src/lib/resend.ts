import { env } from "@/env";
import { getBaseUrl } from "@/trpc/shared";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerficationEmail = async (email: string, token: string) => {
  const confirmLink = getBaseUrl() + "/new-verification/" + token;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm yout email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendResetPassword = async (email: string, token: string) => {
  const resetLink = getBaseUrl() + "/reset-password/" + token;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

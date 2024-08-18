import { z } from "zod";

const trimString = z.string().trim();

export const RegisterInputSchema = z
  .object({
    email: trimString
      .min(1, "Email is required")
      .email({ message: "Not a valid email" }),
    username: trimString
      .min(4, "Password must be at least 4 characters long")
      .max(30, "Password can't be longer than 30 characters"),
    password: trimString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
    confirmPassword: trimString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const LoginInputSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z.string({ required_error: "Password is required" }),
});

export type RegisterBodyType = Omit<
  z.infer<typeof RegisterInputSchema>,
  "confirmPassword"
>;

export type LoginBodyType = z.infer<typeof LoginInputSchema>;

export const ForgotPasswordSchema = z.object({
  email: trimString
    .min(1, "Email is required")
    .email({ message: "Not a valid email" }),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export const ConfirmPasswordSchema = z
  .object({
    password: trimString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
    confirmPassword: trimString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type ConfirmPasswordInputType = z.infer<typeof ConfirmPasswordSchema>;

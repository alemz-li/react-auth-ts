import { z } from "zod";

export const requiredString = z.string().trim().min(1, "Required");

export const registerFormSchema = z
  .object({
    username: requiredString
      .min(4, "Password must be at least 4 characters long")
      .max(30, "Password can't be longer than 30 characters"),
    email: requiredString.email({ message: "Not a valid email" }),
    password: requiredString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
    confirmPassword: requiredString
      .min(8, "Password must be at least 8 characters long")
      .max(45, "Password can't be longer than 45 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const forgotPasswordSchema = z.object({
  email: requiredString.email({ message: "Not a valid email" }),
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

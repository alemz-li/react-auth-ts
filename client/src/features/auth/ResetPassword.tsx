import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requiredString } from "@/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "./authApiSlice";

const confirmPasswordSchema = z
  .object({
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

type confirmPasswordType = z.infer<typeof confirmPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token] = useState<string | null>(searchParams.get("token"));
  const [submitResetPassword] = useResetPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);

  const onSubmit = async (values: confirmPasswordType) => {
    console.log(values);
    if (!token) return;

    console.log(token);
    await submitResetPassword({ ...values, token });
  };

  const form = useForm<confirmPasswordType>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <main>
      <h1 className="text-center">Reset password</h1>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}

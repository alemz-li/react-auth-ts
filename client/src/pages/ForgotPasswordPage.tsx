import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/features/auth/authApiSlice";
import { forgotPasswordSchema, ForgotPasswordType } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [requestPasswordReset, { isSuccess }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordType) => {
    console.log(values);
    await requestPasswordReset(values);
  };

  return (
    <main>
      <div>
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p>
          Enter your email address or username and we’ll send you a link to
          reset your password.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSuccess}>
            Send reset link
          </Button>
        </form>
      </Form>
      <div>
        {isSuccess && (
          <p>You will receive a reset email with further instructions.</p>
        )}
      </div>
      <Link to="/login">Go to Login</Link>
    </main>
  );
}

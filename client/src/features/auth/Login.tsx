import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormType } from "@/validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Link } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentToken, setCredentials } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    if (token) navigate("/home");
  }, [token]);

  const dispatch = useAppDispatch();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (values: LoginFormType) => {
    setError(null);

    try {
      const { accessToken } = await login(values).unwrap();
      dispatch(setCredentials({ accessToken }));

      navigate("/home");
    } catch (error: any) {
      console.error(error);
      setError(error.data.message);
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Link to="/forgot-password" className="text-blue-500">
              Forgot password?
            </Link>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="text-center">
        Don&apos;t have an account?
        <Link to="/register">
          <span className="text-blue-500"> Register</span>
        </Link>
        <Link to="/home">
          <span className="text-blue-500"> Home</span>
        </Link>
      </p>
    </>
  );
}

export default Login;

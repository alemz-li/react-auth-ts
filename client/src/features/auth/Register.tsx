import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormType, registerFormSchema } from "@/validation";
import { useNavigate } from "react-router-dom";

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
import { useRegisterMutation } from "./authApiSlice";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentToken, setCredentials } from "./authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";

function Register() {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    if (token) navigate("/home");
  }, [token]);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [register, { isLoading }] = useRegisterMutation();

  const onSubmit = async (values: RegisterFormType) => {
    try {
      const { accessToken } = await register({ ...values }).unwrap();
      dispatch(setCredentials({ accessToken }));

      console.log(accessToken);
      console.log("success");
      navigate("/home");
    } catch (error: any) {
      console.log(error);
      setError(error.data.message);
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="text-center">
        Already have an account?
        <Link to="/login">
          <span className="text-blue-500"> Log in</span>
        </Link>
      </p>
    </>
  );
}

export default Register;

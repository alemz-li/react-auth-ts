import { apiSlice } from "../../app/api/apiSlice";

import { LoginFormType, RegisterFormType } from "@/validation";

type AuthResponseType = {
  accessToken: string;
};

type ResetPasswordType = {
  token: string;
  password: string;
  confirmPassword: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponseType, RegisterFormType>({
      query: (credentials) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    login: builder.mutation<AuthResponseType, LoginFormType>({
      query: (credentials) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    refresh: builder.query<AuthResponseType, void>({
      query: () => "/v1/auth/refresh",
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/v1/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: "/v1/auth/forgot-password",
        method: "POST",
        body: { ...email },
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordType>({
      query: (data) => ({
        url: `/v1/auth/reset-password?token=${data.token}`,
        method: "PATCH",
        body: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;

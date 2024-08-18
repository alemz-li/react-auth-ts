import { apiSlice } from "@/app/api/apiSlice";

export const testApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => "/v1/data",
    }),
  }),
});

export const { useLazyGetDataQuery } = testApiSlice;

import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";

export default function LayoutWithPersist() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffectAfterMount(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/refresh",
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();

        const { accessToken } = data;
        console.log("new accesstoken", accessToken);
        dispatch(setCredentials({ accessToken }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="px-2 max-w-[1100px] m-auto">
        {isLoading ? (
          <p className="text-4xl text-red-500">Loading...</p>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}

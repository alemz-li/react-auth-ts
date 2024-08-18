import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { useLazyGetDataQuery } from "@/features/test/testApiSlice";

export default function HomePage() {
  const token = useAppSelector(selectCurrentToken);

  const [trigger, { data, isLoading, isError, error }] = useLazyGetDataQuery();

  const handleClick = () => {
    trigger(undefined, false);
  };

  return (
    <>
      <h1 className="text-4xl font-bold">This is the Home page</h1>
      {token ? "There is a token" : "There is NO token"}
      <Button onClick={handleClick}>Get Data</Button>

      <div>{isLoading && <p>Loading....</p>}</div>
      <div>{isError && <p>Error occured {JSON.stringify(error)}</p>}</div>
      <div>{data && <p>data from query</p>}</div>
    </>
  );
}

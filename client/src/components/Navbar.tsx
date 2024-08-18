import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useLogoutMutation } from "@/features/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, selectCurrentToken } from "@/features/auth/authSlice";

export default function Navbar() {
  const [logoutMutation] = useLogoutMutation();
  const token = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logoutMutation();
    dispatch(logout());
  };

  return (
    <header>
      <nav className="flex justify-between items-center bg-gray-200 p-2 mb-2">
        <div>
          <h1 className="text-2xl font-bold">Express Auth</h1>
        </div>
        <div>
          <ul className="flex space-x-4">
            {!token ? (
              <>
                <li>
                  <Link to="register">Register</Link>
                </li>
                <li>
                  <Link to="login">Login</Link>
                </li>
              </>
            ) : (
              <li>
                <Button onClick={handleLogout}>Log out</Button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

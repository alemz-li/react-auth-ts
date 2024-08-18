import { Outlet } from "react-router-dom";

function Layout({}) {
  return (
    <main className="px-2 max-w-[1100px] m-auto">
      <Outlet />
    </main>
  );
}

export default Layout;

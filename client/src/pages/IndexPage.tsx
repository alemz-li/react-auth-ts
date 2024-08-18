import { Link } from "react-router-dom";

const pageLinks = [
  {
    page: "Register",
    href: "/register",
  },
  {
    page: "Login",
    href: "/login",
  },
];

function IndexPage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Home page</h1>
      <div>
        <ul>
          {pageLinks.map((page) => (
            <li key={page.page}>
              <Link to={page.href} className="underline">
                Go to {page.page}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default IndexPage;

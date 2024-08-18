import { Routes, Route } from "react-router-dom";
import LayoutWithPersist from "./components/LayoutWithPersist";
import IndexPage from "./pages/IndexPage";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPassword from "./features/auth/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutWithPersist />}>
          <Route index element={<IndexPage />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<HomePage />} />
          </Route>
          <Route path="*" element={<p>404 - Not Found</p>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

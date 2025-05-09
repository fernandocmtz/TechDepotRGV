// PrivateRoute.tsx
import { useAuth } from "@/context/auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux";

interface ProtectedRouteProps {
  requiredRole: number;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const user = useSelector(selectUser);

  return !user ? (
    <Navigate to="/" replace />
  ) : user.role !== requiredRole ? (
    <Navigate to="/access-denied" replace />
  ) : (
    <Outlet />
  );
};

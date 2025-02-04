import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux/authSlice";
import { USER } from "../constants/roles";

interface ProtectedRouteProps {
  requiredRole: number;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== requiredRole) {
    return (
      <Navigate
        to={requiredRole === USER ? "/tests" : "/admin/groups"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

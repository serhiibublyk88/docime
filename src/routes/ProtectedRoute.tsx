import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux/authSlice"; 
import { roles } from "../constants"; 
import { RootState } from "../redux"; 

interface ProtectedRouteProps {
  requiredRole: number;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => selectUser(state)); 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== requiredRole) {
    return (
      <Navigate
        to={requiredRole === roles.USER ? "/tests" : "/admin/groups"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/authSlice";
import { USER } from "../constants/roles";

const GuestOnlyRoute = () => {
  const user = useSelector(selectUser);

  if (user) {
    
    return (
      <Navigate to={user.role === USER ? "/tests" : "/admin/groups"} replace />
    );
  }

  return <Outlet />;
};

export default GuestOnlyRoute;

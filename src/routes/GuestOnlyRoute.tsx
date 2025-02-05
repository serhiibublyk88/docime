import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/authSlice"; 
import { roles } from "../constants"; 
import { RootState } from "../redux"; 

const GuestOnlyRoute = () => {
  const user = useSelector((state: RootState) => selectUser(state)); 

  if (user) {
    return (
      <Navigate
        to={user.role === roles.USER ? "/tests" : "/admin/groups"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default GuestOnlyRoute;

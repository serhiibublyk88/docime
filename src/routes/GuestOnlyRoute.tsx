import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux";
import { roles } from "../constants";

export const GuestOnlyRoute = () => {
  const user = useSelector(selectUser);

  return user ? (
    <Navigate
      to={user.role === roles.USER ? "/tests" : "/admin/groups"}
      replace
    />
  ) : (
    <Outlet />
  );
};

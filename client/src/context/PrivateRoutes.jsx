import { Outlet, Navigate } from "react-router";
import { myContext } from "./Context";

const PrivateRoutes = () => {
  const { status } = myContext();

  return status === 200 ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

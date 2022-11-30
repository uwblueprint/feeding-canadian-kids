import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

const AuthWall: React.FC = () => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? <Outlet /> : <Navigate replace to={LOGIN_PAGE} />;
};

export default AuthWall;

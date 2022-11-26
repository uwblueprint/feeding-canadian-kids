import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

type PrivateRouteProps = {
  element: React.ReactNode;
  path: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate replace to={LOGIN_PAGE} />
  );
};

export default PrivateRoute;

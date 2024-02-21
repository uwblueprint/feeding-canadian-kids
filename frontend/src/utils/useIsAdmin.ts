import { useMediaQuery } from "@chakra-ui/react";
import { useContext } from "react";

import AuthContext from "../contexts/AuthContext";

const useIsAdmin = (): boolean => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  return authenticatedUser?.info?.role === "Admin";
};

export default useIsAdmin;

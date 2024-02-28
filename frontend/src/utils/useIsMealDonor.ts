import { useMediaQuery } from "@chakra-ui/react";
import { useContext } from "react";

import AuthContext from "../contexts/AuthContext";

const useIsMealDonor = (): boolean => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  return authenticatedUser?.info?.role === "Donor";
};

export default useIsMealDonor;

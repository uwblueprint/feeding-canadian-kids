import { useContext } from "react";

import useIsAdmin from "./useIsAdmin";
import useIsMealDonor from "./useIsMealDonor";

import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";

export function useGetDefaultPageForUser() {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const isMealDonor = useIsMealDonor();
  const isAdmin = useIsAdmin();

  if (!authenticatedUser) {
    // console.log("not logged in navigating to login");
    return Routes.LOGIN_PAGE;
  }

  if (isMealDonor) {
    return Routes.YOUR_MATCHES_PAGE;
  }

  if (isAdmin) {
    return Routes.ONBOARDING_REQUESTS_PAGE;
  }

  return Routes.ASP_DASHBOARD_PAGE;
}

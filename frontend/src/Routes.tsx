import React from "react";
import { Route, Routes as RouteContainer } from "react-router-dom";

import AuthWall from "./components/auth/AuthWall";
import ForgotPassword from "./components/auth/ForgotPassword";
import Join from "./components/auth/Join";
import JoinSuccess from "./components/auth/JoinSuccess";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import SetPassword from "./components/auth/SetPassword";
import Dashboard from "./components/pages/Dashboard";
import Default from "./components/pages/Default";
import HooksDemo from "./components/pages/HooksDemo";
import NotFound from "./components/pages/NotFound";
import Settings from "./components/pages/Settings";
import TemporaryOnboardingRequestPage from "./components/pages/TemporaryOnboardingRequestPage";
import * as Paths from "./constants/Routes";

const Routes = (): React.ReactElement => (
  <RouteContainer>
    <Route path={Paths.HOME_PAGE} element={<Default />} />
    <Route path={Paths.LOGIN_PAGE} element={<Login />} />
    <Route path={Paths.JOIN_PAGE} element={<Join />} />
    <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
    <Route path={Paths.JOIN_SUCCESS_PAGE} element={<JoinSuccess />} />
    <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
    <Route path={Paths.RESET_PASSWORD_PAGE} element={<ResetPassword />} />
    <Route path={Paths.SET_PASSWORD_PAGE} element={<SetPassword />} />
    <Route path={Paths.SETTINGS_PAGE} element={<Settings />} />
    <Route path={Paths.DASHBOARD_PAGE} element={<AuthWall />}>
      <Route path="" element={<Dashboard />} />
      <Route path={Paths.HOOKS_PAGE} element={<HooksDemo />} />
      <Route
        path={Paths.TEMP_ONBOARDING_REQUEST_PAGE}
        element={<TemporaryOnboardingRequestPage />}
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </RouteContainer>
);

export default Routes;

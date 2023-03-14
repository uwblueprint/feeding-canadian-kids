import React from "react";
import { Route, Routes as RouteContainer } from "react-router-dom";

import AuthWall from "./components/auth/AuthWall";
import ForgotPassword from "./components/auth/ForgotPassword";
import Join from "./components/auth/Join";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import SetPassword from "./components/auth/SetPassword";
import Signup from "./components/auth/Signup";
import CreatePage from "./components/pages/CreatePage";
import Dashboard from "./components/pages/Dashboard";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
import NotFound from "./components/pages/NotFound";
import SimpleEntityCreatePage from "./components/pages/SimpleEntityCreatePage";
import SimpleEntityDisplayPage from "./components/pages/SimpleEntityDisplayPage";
import SimpleEntityUpdatePage from "./components/pages/SimpleEntityUpdatePage";
import UpdatePage from "./components/pages/UpdatePage";
import * as Paths from "./constants/Routes";

const Routes = (): React.ReactElement => (
  <RouteContainer>
    <Route path={Paths.HOME_PAGE} element={<Default />} />
    <Route path={Paths.LOGIN_PAGE} element={<Login />} />
    <Route path={Paths.JOIN_PAGE} element={<Join />} />
    <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
    <Route path={Paths.SIGNUP_PAGE} element={<Signup />} />
    <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
    <Route path={Paths.RESET_PASSWORD_PAGE} element={<ResetPassword />} />
    <Route path={Paths.SET_PASSWORD_PAGE} element={<SetPassword />} />
    <Route path={Paths.DASHBOARD_PAGE} element={<AuthWall />}>
      <Route path="" element={<Dashboard />} />
      <Route path={Paths.CREATE_ENTITY_PAGE} element={<CreatePage />} />
      <Route path={Paths.UPDATE_ENTITY_PAGE} element={<UpdatePage />} />
      <Route path={Paths.DISPLAY_ENTITY_PAGE} element={<DisplayPage />} />
      <Route
        path={Paths.CREATE_SIMPLE_ENTITY_PAGE}
        element={<SimpleEntityCreatePage />}
      />
      <Route
        path={Paths.UPDATE_SIMPLE_ENTITY_PAGE}
        element={<SimpleEntityUpdatePage />}
      />
      <Route
        path={Paths.DISPLAY_SIMPLE_ENTITY_PAGE}
        element={<SimpleEntityDisplayPage />}
      />
      <Route path={Paths.EDIT_TEAM_PAGE} element={<EditTeamInfoPage />} />
      <Route path={Paths.HOOKS_PAGE} element={<HooksDemo />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </RouteContainer>
);

export default Routes;

import React from "react";
import { Route, Routes as RouteContainer } from "react-router-dom";

import CreateMealRequest from "./components/asp/requests/CreateMealRequest";
import AuthWall from "./components/auth/AuthWall";
import ForgotPassword from "./components/auth/ForgotPassword";
import Join from "./components/auth/Join";
import JoinSuccess from "./components/auth/JoinSuccess";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import SetPassword from "./components/auth/SetPassword";
import MealDonationForm from "./components/meal_donor/donation_form/MealDonationForm";
import * as Paths from "./constants/Routes";
import Dashboard from "./pages/ASPDashboard";
import CreatePage from "./pages/CreatePage";
import Default from "./pages/Default";
import DisplayPage from "./pages/DisplayPage";
import HooksDemo from "./pages/HooksDemo";
import MealDonorCalendar from "./pages/MealDonorCalendar";
import MealDonorDashboard from "./pages/MealDonorDashboard";
import NotFound from "./pages/NotFound";
import OnboardingRequestsPage from "./pages/OnboardingRequestsPage";
import Settings from "./pages/Settings";
import SimpleEntityCreatePage from "./pages/SimpleEntityCreatePage";
import SimpleEntityDisplayPage from "./pages/SimpleEntityDisplayPage";
import SimpleEntityUpdatePage from "./pages/SimpleEntityUpdatePage";
import UpdatePage from "./pages/UpdatePage";
import YourMatchesPage from "./pages/YourMatchesPage";

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
    <Route
      path={Paths.CREATE_MEAL_REQUEST_PAGE}
      element={<CreateMealRequest />}
    />
    <Route path={Paths.MEAL_DONOR_FORM_PAGE} element={<MealDonationForm />} />
    <Route path="" element={<AuthWall />}>
      <Route path={Paths.SETTINGS_PAGE} element={<Settings />} />
      <Route path={Paths.ASP_DASHBOARD_PAGE} element={<Dashboard />} />
      <Route
        path={Paths.MEAL_DONOR_DASHBOARD_PAGE}
        element={<MealDonorDashboard />}
      />
      <Route
        path={Paths.MEAL_DONOR_CALENDAR_PAGE}
        element={<MealDonorCalendar />}
      />
      <Route path={Paths.YOUR_MATCHES_PAGE} element={<YourMatchesPage />} />
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
      <Route
        path={Paths.ONBOARDING_REQUESTS_PAGE}
        element={<OnboardingRequestsPage />}
      />
      <Route path={Paths.HOOKS_PAGE} element={<HooksDemo />} />
      <Route path={Paths.SETTINGS_PAGE} element={<Settings />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </RouteContainer>
);

export default Routes;

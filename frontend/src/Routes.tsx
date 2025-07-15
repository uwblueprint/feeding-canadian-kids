import React from "react";
import { Navigate, Route, Routes as RouteContainer } from "react-router-dom";

import CreateMealRequest from "./components/asp/requests/CreateMealRequest";
import AuthWall from "./components/auth/AuthWall";
import ForgotPassword from "./components/auth/ForgotPassword";
import Join from "./components/auth/Join";
import JoinSuccess from "./components/auth/JoinSuccess";
import Login from "./components/auth/Login";
import SetPassword from "./components/auth/SetPassword";
import MealDonationForm from "./components/meal_donor/donation_form/MealDonationForm";
import * as Paths from "./constants/Routes";
import Dashboard from "./pages/ASPDashboard";
import AdminMealRequestsPage from "./pages/AdminMealRequestsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import MealDonorCalendar from "./pages/MealDonorCalendar";
import MealDonorConfirmation from "./pages/MealDonorConfirmation";
import NotFound from "./pages/NotFound";
import OnboardingRequestsPage from "./pages/OnboardingRequestsPage";
import Settings from "./pages/Settings";
import UpcomingPage from "./pages/UpcomingPage";
import YourMatchesPage from "./pages/YourMatchesPage";
import { useGetDefaultPageForUser } from "./utils/useGetDefaultPageForUser";

const Routes = (): React.ReactElement => {
  const defaultPage = useGetDefaultPageForUser();

  return (
    <RouteContainer>
      <Route
        path={Paths.HOME_PAGE}
        element={<Navigate replace to={defaultPage} />}
      />
      <Route path={Paths.LOGIN_PAGE} element={<Login />} />
      <Route path={Paths.JOIN_PAGE} element={<Join />} />
      <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
      <Route path={Paths.JOIN_SUCCESS_PAGE} element={<JoinSuccess />} />
      <Route path={Paths.FORGOT_PASSWORD_PAGE} element={<ForgotPassword />} />
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
          element={<Navigate replace to={defaultPage} />}
        />
        <Route
          path={Paths.MEAL_DONOR_CALENDAR_PAGE}
          element={<MealDonorCalendar />}
        />
        <Route path={Paths.YOUR_MATCHES_PAGE} element={<YourMatchesPage />} />
        <Route
          path={Paths.MEAL_DONOR_UPCOMING_PAGE}
          element={<UpcomingPage />}
        />
        <Route
          path={Paths.MEAL_DONOR_CONFIRMATION_PAGE}
          element={<MealDonorConfirmation />}
        />
        <Route
          path={Paths.ONBOARDING_REQUESTS_PAGE}
          element={<OnboardingRequestsPage />}
        />
        <Route path={Paths.ADMIN_MEAL_REQUESTS_PAGE}>
          <Route path="donor/:donorId" element={<AdminMealRequestsPage />} />
          <Route path="asp/:aspId" element={<AdminMealRequestsPage />} />
          <Route path="" element={<AdminMealRequestsPage />} />
        </Route>
        <Route path={Paths.ADMIN_USERS_PAGE} element={<AdminUsersPage />} />
        <Route path={Paths.SETTINGS_PAGE} element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </RouteContainer>
  );
};

export default Routes;

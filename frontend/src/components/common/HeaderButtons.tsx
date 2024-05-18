import * as Routes from "../../constants/Routes";
import { Role } from "../../types/UserTypes";

type HeaderButtonDataType = Record<Role, Array<{ name: string; url: string }>>;
const HeaderButtonsData: HeaderButtonDataType = {
  ASP: [
    {
      name: "Home",
      url: Routes.ASP_DASHBOARD_PAGE,
    },
    {
      name: "Settings",
      url: Routes.SETTINGS_PAGE,
    },
  ],
  Admin: [
    {
      name: "Meal Requests",
      url: Routes.HOME_PAGE,
    },
    {
      name: "Onboarding Requests",
      url: Routes.ONBOARDING_REQUESTS_PAGE,
    },
    {
      name: "List of Users",
      url: Routes.HOME_PAGE,
    },
    {
      name: "Settings",
      url: Routes.SETTINGS_PAGE,
    },
  ],
  Donor: [
    {
      name: "Schools",
      url: Routes.YOUR_MATCHES_PAGE,
    },
    {
      name: "My Donations",
      url: Routes.MEAL_DONOR_UPCOMING_PAGE,
    },
    {
      name: "Settings",
      url: Routes.SETTINGS_PAGE,
    },
  ],
};

export { HeaderButtonsData };

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  accessToken: string;
} | null;

export type OnboardingRequest = {
  id: string;
  info: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    role: "ASP" | "MD";
  };
  dateSubmitted: string;
  status: string;
} | null;

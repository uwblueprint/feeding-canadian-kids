export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  accessToken: string;
} | null;

export type Contact = {
  name: string;
  phone: string;
  email: string;
};

export type Role = "ASP" | "Donor" | "Admin";

export type UserInfo = {
  email: string;
  organizationAddress: string;
  organizationName: string;
  role: Role;
  primaryContact: Contact;
  onsiteContacts: Array<Contact>;
};

export type OnboardingRequest = {
  id: string;
  info: UserInfo;
  dateSubmitted: string;
  status: string;
} | null;

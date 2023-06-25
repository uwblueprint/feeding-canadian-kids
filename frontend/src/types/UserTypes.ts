export type AuthenticatedUser = {
  accessToken: string;
  id: string;
  info: UserInfo;
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

export type UserSettings = {
  primaryContact: Contact;
  organizationName: string;
  numberOfKids: number;
  organizationAddress: string;
  organizationDescription: string;
  onsiteContacts: Array<Contact>;
};

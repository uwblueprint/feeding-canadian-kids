export type LoginData = {
  registeredUser: {
    accessToken: string;
    id: string;
    info: UserInfo;
  };
} | null;

export type AuthenticatedUser = {
  accessToken: string;
  id: string;
  info: UserInfo;
} | null;

export type Requestor = {
  id: string;
  info: UserInfo;
};

export type Contact = {
  name: string;
  phone: string;
  email: string;
};

export type OnsiteContact = {
  id?: string;
  name: string;
  phone: string;
  email: string;
};

type Donor = "Restaurant" | "Individual";

type ASPInfo = {
  numKids: number;
};

type DonorInfo = {
  type: Donor;
  tags: Array<string>;
};

type RoleInfo = {
  aspInfo: ASPInfo | null;
  donorInfo: DonorInfo | null;
};

export type Role = "ASP" | "Donor" | "Admin";

export type UserInfo = {
  email: string;
  organizationAddress: string;
  organizationName: string;
  organizationDesc: string;
  role: Role;
  roleInfo: RoleInfo;
  primaryContact: Contact;
  initialOnsiteContacts: Array<Contact>;
  active?: boolean;
} | null;

export type ASPDistance = {
  id: string;
  info: UserInfo;
  distance: number;
} | null;

export type OnboardingRequest = {
  id: string;
  info: UserInfo;
  dateSubmitted: string;
  status: string;
} | null;

export type UserData = {
  id: string;
  info: UserInfo;
}

export type GetUserData = {
  getUserById: UserData;
};

export type GetUserVariables = {
  id: string;
};

export type GetAllUsersData = {
  getAllUsers: Array<UserData>;
};

export type GetAllUserVariables = {
  limit: number;
  offset: number;
  role: Role;
  name: string;
};
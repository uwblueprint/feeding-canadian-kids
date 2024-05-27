import { Contact, OnsiteContact, Requestor } from "./UserTypes";

type MealInfo = {
  portions: number;
  dietaryRestrictions: string;
  mealSuggestions: string;
};

type DonationInfo = {
  donor: Requestor;
  commitmentDate: Date;
  mealDescription: string;
  additionalInfo: string;
  donorOnsiteContacts: Array<OnsiteContact>;
};

export enum MealStatus {
  OPEN = "OPEN",
  UPCOMING = "UPCOMING",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
}

export type MealRequest = {
  id: string;
  requestor: Requestor;
  description: string;
  status: string;
  dropOffDatetime: string;
  dropOffLocation: string;
  mealInfo: MealInfo;
  onsiteContacts: Array<OnsiteContact>;
  dateCreated: string;
  dateUpdated: string;
  deliveryInstructions: string;
  donationInfo: DonationInfo;
};

export type SortByDateDirection = "ASCENDING" | "DESCENDING";

export type MealRequestsVariables = {
  requestorId: string;
  minDropOffDate?: string | Date;
  maxDropOffDate?: string | Date;
  status?: Array<MealStatus>;
  offset?: number;
  limit?: number;
  sortByDateDirection?: SortByDateDirection;
};

export type MealRequestsDonorVariables = {
  donorId: string;
  minDropOffDate?: string | Date;
  maxDropOffDate?: string | Date;
  status?: Array<MealStatus>;
  offset?: number;
  limit?: number;
  sortByDateDirection?: SortByDateDirection;
};

export type MealRequestsData = {
  getMealRequestsByRequestorId: Array<MealRequest>;
  getMealRequestById: MealRequest;
  getMealRequestsByIds: Array<MealRequest>;
  getMealRequestsByDonorId: Array<MealRequest>;
};

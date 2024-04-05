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
  status: string;
  dropOffDatetime: Date;
  dropOffLocation: string;
  mealInfo: MealInfo;
  onsiteContacts: Array<OnsiteContact>;
  dateCreated: Date;
  dateUpdated: Date;
  deliveryInstructions: string;
  donationInfo: DonationInfo;
};

export type MealRequestsVariables = {
  requestorId: string;
  minDropOffDate?: Date;
  maxDropOffDate?: Date;
  status?: Array<MealStatus>;
  offset?: number;
  limit?: number;
  sortByDateDirection?: "ASCENDING" | "DESCENDING";
};

export type MealRequestsData = {
  getMealRequestsByRequestorId: Array<MealRequest>;
  getMealRequestById: MealRequest;
};

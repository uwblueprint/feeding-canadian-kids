import { Contact, Requestor } from "./UserTypes";

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
  OPEN = "Open",
  FULFILLED = "Fulfilled",
  CANCELLED = "Cancelled",
}

export type MealRequest = {
  id: string;
  requestor: Requestor;
  description: string;
  status: string;
  dropOffDatetime: Date;
  dropOffLocation: string;
  mealInfo: MealInfo;
  onsiteStaff: Array<Contact>;
  dateCreated: Date;
  dateUpdated: Date;
  deliveryInstructions: string;
  donationInfo: DonationInfo;
};

export type MealRequestsVariables = {
  requestorId: string;
  minDropOffDate?: Date;
  maxDropOffDate?: Date;
  status?: MealStatus;
  offset?: number;
  limit?: number;
  sortByDateDirection?: "ASC" | "DESC";
};

export type MealRequestsData = {
  getMealRequestsByRequestorId: Array<MealRequest>;
};
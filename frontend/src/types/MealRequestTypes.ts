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
  mealInfo: MealInfo;
  onsiteContacts: Array<OnsiteContact>;
  dateCreated: string;
  dateUpdated: string;
  deliveryInstructions: string;
  donationInfo: DonationInfo;
};

export type SortByDateDirection = "ASCENDING" | "DESCENDING";

export type MealRequestsVariables = {
  adminId: string;
  minDropOffDate?: string | Date;
  maxDropOffDate?: string | Date;
  status?: Array<MealStatus>;
  offset?: number;
  limit?: number;
  sortByDateDirection?: SortByDateDirection;
};

export type MealRequestsRequestorVariables = {
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

type UpdateMealRequestType =  {
  mealRequest : MealRequest
}

export type MealRequestsData = {
  getMealRequestsByRequestorId: Array<MealRequest>;
  getMealRequestById: MealRequest;
  getMealRequests: Array<MealRequest>;
  getMealRequestsByIds: Array<MealRequest>;
  getMealRequestsByDonorId: Array<MealRequest>;
  updateMealRequest: UpdateMealRequestType;
  updateMealDonation: UpdateMealRequestType;
};

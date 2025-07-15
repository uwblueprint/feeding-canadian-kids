import { Tag } from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React from "react";

import { MealRequest, MealStatus } from "../types/MealRequestTypes";

export const convertMealRequestsToTableNodes = (
  mealRequests: MealRequest[] | undefined,
) => {
  if (!mealRequests) {
    return [];
  }

  return mealRequests.map(
    (
      mealRequest: MealRequest,
      index: number,
    ): TABLE_LIBRARY_TYPES.TableNode => {
      return {
        id: index,
        meal_request_id: mealRequest.id,
        date_requested: new Date(mealRequest.dropOffDatetime + "Z"),
        time_requested: new Date(mealRequest.dropOffDatetime + "Z"),
        location: mealRequest.requestor.info?.organizationAddress,
        delivery_instructions: mealRequest.deliveryInstructions,
        dietary_restrictions: mealRequest.mealInfo?.dietaryRestrictions,
        num_meals: mealRequest.mealInfo?.portions,
        asp_name: mealRequest.requestor.info?.organizationName,
        asp_onsite_contacts: mealRequest.onsiteContacts,
        asp_primary_contact: mealRequest.requestor.info?.primaryContact,
        asp_login_email: mealRequest.requestor.info?.email,
        donor_name: mealRequest.donationInfo?.donor.info?.organizationName,
        donor_onsite_contacts: mealRequest.donationInfo?.donorOnsiteContacts,
        donor_primary_contact:
          mealRequest.donationInfo?.donor.info?.primaryContact,
        donor_login_email: mealRequest.donationInfo?.donor.info?.email,
        // We want to check for both undefined and null
        // eslint-disable-next-line eqeqeq
        has_donor: mealRequest.donationInfo != undefined,
        commitment_date: new Date(
          (mealRequest.donationInfo?.commitmentDate ?? "") + "Z",
        ),
        donation_meal_description: mealRequest.donationInfo?.mealDescription,
        additional_donation_info: mealRequest.donationInfo?.additionalInfo,
        status: mealRequest.status,
        _hasContent: false,
        nodes: null,
      };
    },
  );
};

export const formatDateTimeFully = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

export const Status = ({ status }: { status: string }) => {
  switch (status) {
    case MealStatus.UPCOMING:
      return (
        <Tag size="sm" borderRadius="full" colorScheme="purple">
          Upcoming
        </Tag>
      );
    case MealStatus.FULFILLED:
      return (
        <Tag size="sm" borderRadius="full" colorScheme="green">
          Fulfilled
        </Tag>
      );
    case MealStatus.CANCELLED:
      return (
        <Tag size="sm" borderRadius="full" colorScheme="red">
          Cancelled
        </Tag>
      );
    default:
      return (
        <Tag size="sm" borderRadius="full" colorScheme="gray">
          Open
        </Tag>
      );
  }
};

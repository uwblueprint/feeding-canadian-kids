import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useEffect, useState } from "react";

import { Contact } from "../../types/UserTypes";
import { formatDateTimeFully } from "../../utils/convertMealRequestsToTableNodes";
import ListView from "../common/ListView";

type MealDonorListViewProps = {
  completedMealRequests:
    | {
        nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
      }
    | undefined;
  completedMealRequestsLoading: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const MealDonorListView = ({
  completedMealRequests,
  completedMealRequestsLoading,
  currentPage,
  setCurrentPage,
}: MealDonorListViewProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const COLUMNS = [
    {
      label: "Date",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">
          {item.date_requested.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      ),
    },
    {
      label: "Time Requested",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">
          {item.time_requested.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ),
    },
    {
      label: "ASP Name",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text
          variant="desktop-xs"
          // fontStyle={item.pending ? "italic" : "normal"}
          // color={item.pending ? "gray.400" : "inherit"}
        >
          {item.asp_name}
        </Text>
      ),
    },
    {
      label: "# of Meals",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.num_meals}</Text>
      ),
    },
    {
      label: "",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Flex
          cursor="pointer"
          justifyContent="flex-end"
          onClick={handleExpand(item)}
        >
          {ids.includes(item.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      ),
    },
  ];

  const ROW_OPTIONS = {
    renderAfterRow: (item: TABLE_LIBRARY_TYPES.TableNode) => (
      <Collapse className="animate" in={ids.includes(item.id)}>
        <Flex
          flexDir="row"
          p="16px"
          borderBottom="1px solid"
          borderColor="gray.400"
        >
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Time Requested</Text>
            <Text variant="mobile-caption-2">
              {formatDateTimeFully(item.date_requested)}
            </Text>

            <Text variant="mobile-button-bold">Dietary Restrictions</Text>
            <Text variant="mobile-caption-2">{item.dietary_restrictions}</Text>

            <Text variant="mobile-button-bold">Meal Donation Location</Text>
            <Text variant="mobile-caption-2">{item.location}</Text>

            <Text variant="mobile-button-bold"> Delivery Instructions </Text>
            <Text variant="mobile-caption-2">{item.delivery_instructions}</Text>

            <Text variant="mobile-button-bold">Number of meals</Text>
            <Text variant="mobile-caption-2">{item.num_meals}</Text>
          </Box>
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">ASP Name</Text>
            <Text variant="mobile-caption-2">{item.asp_name}</Text>
            <Text variant="mobile-button-bold">ASP Primary Contact</Text>
            <Box key={item.asp_primary_contact.id} mb="8px">
              <Text variant="mobile-caption-2">
                {item.asp_primary_contact.name}
              </Text>
              <Text variant="mobile-caption-2">
                {item.asp_primary_contact.email}
              </Text>
              <Text variant="mobile-caption-2">
                {item.asp_primary_contact.phone}
              </Text>
            </Box>
            <Text variant="mobile-button-bold">Onsite ASP Contacts</Text>
            {item.asp_onsite_contacts?.map((contact: Contact) => (
              <Box key={contact.email} mb="8px">
                <Text variant="mobile-caption-2">{contact.name}</Text>
                <Text variant="mobile-caption-2">{contact.email}</Text>
                <Text variant="mobile-caption-2">{contact.phone}</Text>
              </Box>
            ))}
          </Box>

          {item.has_donor ? (
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">Your Primary Contact</Text>
              <Box key={item.donor_primary_contact.id} mb="8px">
                <Text variant="mobile-caption-2">
                  {item.donor_primary_contact.name}
                </Text>
                <Text variant="mobile-caption-2">
                  {item.donor_primary_contact.email}
                </Text>
                <Text variant="mobile-caption-2">
                  {item.donor_primary_contact.phone}
                </Text>
              </Box>
              <Text variant="mobile-button-bold">Your Onsite Contacts</Text>
              {item.donor_onsite_contacts?.map((contact: Contact) => (
                <Box key={contact.email} mb="8px">
                  <Text variant="mobile-caption-2">{contact.name}</Text>
                  <Text variant="mobile-caption-2">{contact.email}</Text>
                  <Text variant="mobile-caption-2">{contact.phone}</Text>
                </Box>
              ))}

              <Text variant="mobile-button-bold">Commitment Date</Text>
              <Text variant="mobile-caption-2">
                {formatDateTimeFully(item.commitment_date)}
              </Text>
              <Text variant="mobile-button-bold">Your Meal Description</Text>
              <Text variant="mobile-caption-2">
                {formatDateTimeFully(item.donation_meal_description)}
              </Text>
              <Text variant="mobile-button-bold">
                Your Additional Information{" "}
              </Text>
              <Text variant="mobile-caption-2">
                {formatDateTimeFully(item.additional_donation_info)}
              </Text>
            </Box>
          ) : null}
          </Flex>
      </Collapse>
    ),
  };

  return (
    <ListView
      columns={COLUMNS}
      rowOptions={ROW_OPTIONS}
      data={completedMealRequests}
      loading={completedMealRequestsLoading}
      requestType="Meal Requests"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default MealDonorListView;

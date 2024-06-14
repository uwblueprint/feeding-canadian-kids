import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useEffect, useState } from "react";

import { Contact } from "../../types/UserTypes";
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
          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-caption-bold">Donation Address</Text>
            <Text variant="mobile-caption-2" mb="12px">
              {item.donation_address}
            </Text>
            <Text variant="mobile-caption-bold">Dietary Restrictions</Text>
            <Text variant="mobile-caption-2">{item.dietary_restrictions}</Text>
          </Flex>
          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-caption-bold">ASP Onsite Staff</Text>
            {item.onsite_contact.map((staff: Contact) => (
              <Box key={staff.email} mb="8px">
                <Text variant="mobile-caption-2">{staff.name}</Text>
                <Text variant="mobile-caption-2">{staff.email}</Text>
                <Text variant="mobile-caption-2">{staff.phone}</Text>
              </Box>
            ))}
          </Flex>
          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-caption-bold">My Contact Info</Text>
            <Text variant="mobile-caption-2" mb="12px">
              {item.contact_info}
            </Text>
            <Text variant="mobile-caption-bold">Meal Description:</Text>
            <Text variant="mobile-caption-2">{item.meal_description}</Text>
          </Flex>
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

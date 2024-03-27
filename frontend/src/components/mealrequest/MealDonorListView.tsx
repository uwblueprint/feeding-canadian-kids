import { gql, useLazyQuery } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Box,
    Button as ChakraButton,
    Collapse,
    Flex,
    HStack,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
  } from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";

import React, { useEffect, useState } from "react";

import { MealRequest, MealRequestsData, MealRequestsVariables, MealStatus } from "../../types/MealRequestTypes";
import { Contact } from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import ListView from "../common/ListView";

const GET_MEAL_REQUESTS_BY_ID = gql`
  query GetMealRequestsByRequestorId(
    $requestorId: ID!
    $minDropOffDate: Date
    $maxDropOffDate: Date
    $status: [MealStatus]
    $offset: Int
    $limit: Int
    $sortByDateDirection: SortDirection
  ) {
    getMealRequestsByRequestorId(
      requestorId: $requestorId
      minDropOffDate: $minDropOffDate
      maxDropOffDate: $maxDropOffDate
      status: $status
      offset: $offset
      limit: $limit
      sortByDateDirection: $sortByDateDirection
    ) {
      id
      requestor {
        info {
          organizationName,
          primaryContact {
            name
            email
            phone
          }
        }
      }
      status
      dropOffDatetime
      dropOffLocation
      mealInfo {
        portions
        dietaryRestrictions
      }
      onsiteStaff {
        name
        email
        phone
      }
      deliveryInstructions
      donationInfo {
        donor {
          info {
            organizationName
          }
        }
        mealDescription
      }
    }
  }
`;

type MealDonorListViewProps = { authId: string; filter: string; rowsPerPage?: number }

const MealDonorListView = ({ authId, filter, rowsPerPage = 10 }: MealDonorListViewProps) => {
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

    const [data, setData] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
    }>();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [
        getMealRequests,
        {
          loading: getMealRequestsLoading,
          error: getMealRequestsError,
          data: getMealRequestsData,
        },
      ] = useLazyQuery<MealRequestsData, MealRequestsVariables>(
        GET_MEAL_REQUESTS_BY_ID,
        {
          onCompleted: (results) => {
            setData({
              nodes: results.getMealRequestsByRequestorId?.map(
                (
                  mealRequest: MealRequest,
                  index: number,
                ): TABLE_LIBRARY_TYPES.TableNode => ({
                  id: index,
                  meal_request_id: mealRequest.id,
                  date_requested: new Date(mealRequest.dropOffDatetime),
                  time_requested: new Date(mealRequest.dropOffDatetime),
                  asp_name: mealRequest.requestor.info?.organizationName,
                  num_meals: mealRequest.mealInfo?.portions,
                  donation_address: mealRequest.dropOffLocation,
                  dietary_restrictions: mealRequest.mealInfo.dietaryRestrictions,
                  contact_info: "TODO: donor primaryContact", // mealRequest.donationInfo.primaryContact
                  onsite_staff: mealRequest.onsiteStaff,
                  meal_description: mealRequest.donationInfo?.mealDescription,
                  _hasContent: false,
                  nodes: null,
                }),
              ),
            });
          },
        },
      );

    logPossibleGraphQLError(getMealRequestsError);

    function reloadMealRequests() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      getMealRequests({
          variables: {
              requestorId: authId,
              sortByDateDirection:
                  filter === "DESCENDING" ? "DESCENDING" : "ASCENDING",
              limit: rowsPerPage,
              offset: (currentPage - 1) * rowsPerPage,
              status: [MealStatus.UPCOMING, MealStatus.FULFILLED],
              maxDropOffDate: yesterday.toISOString().split('T')[0]
          },
      });
    }

    useEffect(() => {
        reloadMealRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, currentPage]);

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
                        <Text variant="mobile-caption-2" mb="8px">{item.donation_address}</Text>
                        <Text variant="mobile-caption-bold">Dietary Restrictions</Text>
                        <Text variant="mobile-caption-2">{item.dietary_restrictions}</Text>
                    </Flex>
                    <Flex flexDir="column" flex={1} p="8px">
                        <Text variant="mobile-caption-bold">ASP Onsite Staff</Text>
                            {item.onsite_staff.map((staff: Contact) => (
                                <Box key={staff.email} mb="4px">
                                    <Text variant="mobile-caption-2">{staff.name}</Text>
                                    <Text variant="mobile-caption-2">{staff.email}</Text>
                                    <Text variant="mobile-caption-2">{staff.phone}</Text>
                                </Box>
                            ))}
                    </Flex>
                    <Flex flexDir="column" flex={1} p="8px">
                        <Text variant="mobile-caption-bold">My Contact Info</Text>
                        <Text variant="mobile-caption-2" mb="8px">{item.contact_info}</Text>
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
            data={data}
            loading={getMealRequestsLoading}
            requestType="Meal Requests"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    )
}

export default MealDonorListView;
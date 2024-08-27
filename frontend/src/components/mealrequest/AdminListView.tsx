import { gql, useLazyQuery } from "@apollo/client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
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
  Tag,
  Text,
} from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

import AuthContext from "../../contexts/AuthContext";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsDonorVariables,
  MealRequestsVariables,
  MealStatus,
} from "../../types/MealRequestTypes";
import { Contact } from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import ListView from "../common/ListView";

const GET_MEAL_REQUESTS_BY_DONOR_ID = gql`
  query GetMealRequestsByDonorId(
    $donorId: ID!
    $minDropOffDate: Date
    $maxDropOffDate: Date
    $status: [MealStatus]
    $offset: Int
    $limit: Int
    $sortByDateDirection: SortDirection
  ) {
    getMealRequestsByDonorId(
      donorId: $donorId
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
      mealInfo {
        portions
        dietaryRestrictions
      }
      onsiteContacts {
        name
        email
        phone
      }
      dateCreated
      dateUpdated
      deliveryInstructions
      donationInfo {
        donor {
          info {
            organizationName
          }
        }
        commitmentDate
        mealDescription
        additionalInfo
      }
    }
  }
`

// MODIFY
const GET_MEAL_REQUESTS_BY_REQUESTOR_ID = gql`
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
      mealInfo {
        portions
        dietaryRestrictions
      }
      onsiteContacts {
        name
        email
        phone
      }
      dateCreated
      dateUpdated
      deliveryInstructions
      donationInfo {
        donor {
          info {
            organizationName
          }
        }
        commitmentDate
        mealDescription
        additionalInfo
      }
    }
  }
`;

const Status = ({ status }: { status: string}) => {
  switch(status) {
    case MealStatus.UPCOMING:
      return <Tag size="sm" borderRadius="full" colorScheme="purple">Upcoming</Tag>
    case MealStatus.FULFILLED:
      return <Tag size="sm" borderRadius="full" colorScheme="green">Completed</Tag>
    case MealStatus.CANCELLED:
      return <Tag size="sm" borderRadius="full" colorScheme="red">Cancelled</Tag>
    default:
      return <Tag size="sm" borderRadius="full" colorScheme="gray">Pending</Tag> 
  }
}

type AdminListViewProps = { authId: string; rowsPerPage?: number; donorId?: string; aspId?: string };

const AdminListView = ({ authId, rowsPerPage = 10, donorId, aspId }: AdminListViewProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );
  const [data, setData] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
  }>();
  const [filter, setFilter] = useState<Array<MealStatus>>([]);
  const [sort, setSort] = useState<"ASCENDING" | "DESCENDING">("ASCENDING");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { setAuthenticatedUser } = useContext(AuthContext);

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const [
    getMealRequestsByRequestorId,
    {
      loading: getMealRequestsLoading,
      error: getMealRequestsError,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_REQUESTOR_ID,
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
              donor_name:
                mealRequest.donationInfo?.donor.info?.organizationName,
              num_meals: mealRequest.mealInfo?.portions,
              onsite_contact: mealRequest.onsiteContacts,
              meal_description: mealRequest.donationInfo?.mealDescription,
              dietary_restrictions: mealRequest.mealInfo?.dietaryRestrictions,
              status: mealRequest.status,
              _hasContent: false,
              nodes: null,
            }),
          ),
        });
      },
    },
  );

  const [
    getMealRequestsByDonorId,
    {
      loading: getMealRequestsDonorLoading,
      error: getMealRequestsDonorError,
    }
  ] = useLazyQuery<MealRequestsData, MealRequestsDonorVariables>(
    GET_MEAL_REQUESTS_BY_DONOR_ID,
    {
      onCompleted: (results) => {
        setData({
          nodes: results.getMealRequestsByDonorId?.map(
            (
              mealRequest: MealRequest,
              index: number,
            ): TABLE_LIBRARY_TYPES.TableNode => ({
              id: index,
              meal_request_id: mealRequest.id,
              date_requested: new Date(mealRequest.dropOffDatetime),
              time_requested: new Date(mealRequest.dropOffDatetime),
              asp_name: mealRequest.requestor.info?.organizationName,
              donor_name:
                mealRequest.donationInfo?.donor.info?.organizationName,
              num_meals: mealRequest.mealInfo?.portions,
              onsite_contact: mealRequest.onsiteContacts,
              meal_description: mealRequest.donationInfo?.mealDescription,
              dietary_restrictions: mealRequest.mealInfo?.dietaryRestrictions,
              status: mealRequest.status,
              _hasContent: false,
              nodes: null,
            }),
          ),
        });
      },
    },
  );

  useEffect(() => {
    function reloadMealRequests() {
      if (donorId) {
        getMealRequestsByDonorId({
          variables: {
            donorId,
            sortByDateDirection: sort,
            ...(filter.length > 0 && { status: filter }),
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
      } else if (aspId) {
        getMealRequestsByRequestorId({
          variables: {
            requestorId: aspId,
            sortByDateDirection: sort,
            ...(filter.length > 0 && { status: filter }),
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
      } else {
        getMealRequestsByRequestorId({
          variables: {
            requestorId: authId, // MODIFY
            sortByDateDirection: sort,
            ...(filter.length > 0 && { status: filter }),
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
      }
    }
    reloadMealRequests();
  }, [filter, sort, currentPage]);

  const handleDelete = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    // eslint-disable-next-line no-console
    console.log("delete clicked for item", item.id);
  };

  const COLUMNS = [
    {
      label: "Date Requested",
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
      label: "Donor's Name",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text
          variant="desktop-xs"
          fontStyle={item.pending ? "italic" : "normal"}
          color={item.pending ? "gray.400" : "inherit"}
        >
          {item.pending ? "Pending Donor" : item.donor_name}
        </Text>
      ),
    },
    {
        label: "ASP Name",
        renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
            <Text variant="desktop-xs">{item.asp_name}</Text>
        ),
    },
    {
      label: "# of Meals",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.num_meals}</Text>
      ),
    },
    {
        label: "Status",
        renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
          <Status status={item.status} />
        ),
    },
    {
      label: "",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => {
        if (!item.pending) {
          return (
            <Flex
              cursor="pointer"
              justifyContent="flex-end"
              onClick={handleExpand(item)}
            >
              {ids.includes(item.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          );
        }

        return (
          <HStack>
            <DeleteIcon
              onClick={handleDelete(item)}
              cursor="pointer"
              _hover={{ color: "primary.blue" }}
            />
          </HStack>
        );
      },
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
                <Text variant="mobile-button-bold">Meal Description</Text>
                <Text variant="mobile-caption-2" mb="12px">{item.meal_description}</Text>
                <Text variant="mobile-button-bold">Dietary Restrictions</Text>
                <Text variant="mobile-caption-2">{item.dietary_restrictions}</Text>
            </Box>
            <Box flex={1} p="8px">
                <Text variant="mobile-button-bold">Onsite ASP Contact</Text>
                {item.onsite_contacts?.map((contact: Contact) => (
                    <Box key={contact.email} mb="8px">
                        <Text variant="mobile-caption-2">{contact.name}</Text>
                        <Text variant="mobile-caption-2">{contact.email}</Text>
                        <Text variant="mobile-caption-2">{contact.phone}</Text>
                    </Box>
                ))}
            </Box>
        </Flex>
      </Collapse>
    ),
  };

  if (getMealRequestsError || getMealRequestsDonorError) {
    if (getMealRequestsError) {
      logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);
    } else {
      logPossibleGraphQLError(getMealRequestsDonorError, setAuthenticatedUser);
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="200px"
      >
        <Text>Error while getting meal requests!</Text>
      </Box>
    );
  }

  return (
      <Box mt="24px" width="80%">
        <Flex gap="10px" marginBottom="20px" justifyContent="flex-end">
          <Menu>
            <MenuButton
              as={ChakraButton}
              _hover={{ backgroundColor: "gray.200" }}
              padding="6px 10px"
              borderRadius="3px"
              fontSize="14px"
              border="solid 1px #E2E8F0"
              boxShadow="lg"
              backgroundColor="white"
              color="black"
              minWidth="75px"
            >
              <Flex gap="2px">
                <BsFilter />
                <Text>Sort</Text>
              </Flex>
            </MenuButton>
            <MenuList zIndex="2">
              <MenuOptionGroup
                type="radio"
                value={sort}
                onChange={(value) =>
                  setSort(value as "ASCENDING" | "DESCENDING")
                }
              >
                <MenuItemOption value="ASCENDING">
                  Date Ascending
                </MenuItemOption>
                <MenuItemOption value="DESCENDING">
                  Date Descending
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={ChakraButton}
              _hover={{ backgroundColor: "gray.200" }}
              padding="6px 10px"
              borderRadius="3px"
              fontSize="14px"
              border="solid 1px #E2E8F0"
              boxShadow="lg"
              backgroundColor="white"
              color="black"
              minWidth="75px"
            >
              <Flex gap="2px">
                <FiFilter />
                <Text>
                  Filter {filter.length !== 0 ? `(${filter.join(" - ")})` : ""}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList zIndex="2">
              <MenuOptionGroup
                type="checkbox"
                value={filter}
                onChange={(value) => setFilter(value as Array<MealStatus>)}
              >
                <MenuItemOption value={MealStatus.OPEN}>
                  Pending Meals
                </MenuItemOption>
                <MenuItemOption value={MealStatus.UPCOMING}>
                  Upcoming Meals
                </MenuItemOption>
                <MenuItemOption value={MealStatus.FULFILLED}>
                  Fulfilled Meals
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
        <ListView
          columns={COLUMNS}
          rowOptions={ROW_OPTIONS}
          data={data}
          loading={getMealRequestsLoading || getMealRequestsDonorLoading}
          requestType="Meal Requests"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Box> 
  );
};

export default AdminListView;
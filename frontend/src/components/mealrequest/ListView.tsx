import { gql, useLazyQuery } from "@apollo/client";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
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
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/chakra-ui";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

import EditMealRequestForm from "../../pages/EditMealRequestForm";

import {
  MealRequest,
  MealRequestsData,
  MealRequestsVariables,
  MealStatus,
} from "../../types/MealRequestTypes";
import { Contact } from "../../types/UserTypes";
import { logGraphQLError } from "../../utils/GraphQLUtils";

import LoadingSpinner from "../common/LoadingSpinner";

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

type ListViewProps = { authId: string };

const ListView = ({ authId }: ListViewProps) => {
    const chakraTheme = getTheme(DEFAULT_OPTIONS);
    const customTheme = {
      Table: `
        margin: 0 !important;
        width: 100%;
        --data-table-library_grid-template-columns: repeat(4, minmax(0, 1fr)) 88px;
  
        .animate {
          grid-column: 1 / -1;
  
          display: flex;
        }
  
        .animate > div {
          flex: 1;
          display: flex;
        }
      `,
      HeaderRow: `
        background-color: var(--chakra-colors-gray-50);
        color: var(--chakra-colors-gray-500);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        text-transform: none;
      `,
    };
  
    const theme = useTheme([chakraTheme, customTheme]);
  
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
    const [filter, setFilter] = useState<Array<MealStatus>>([]);
    const [sort, setSort] = useState<"ASCENDING" | "DESCENDING">("ASCENDING");
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
                date_requested: new Date(mealRequest.dateCreated),
                time_requested: new Date(mealRequest.dateCreated),
                donor_name:
                  mealRequest.donationInfo?.donor.info?.organizationName,
                num_meals: mealRequest.mealInfo?.portions,
                primary_contact: mealRequest.requestor.info?.primaryContact,
                onsite_staff: mealRequest.onsiteStaff,
                meal_description: mealRequest.donationInfo?.mealDescription,
                delivery_instructions: mealRequest.deliveryInstructions,
                pending: mealRequest.status === "Open",
                _hasContent: false,
                nodes: null,
              }),
            ),
          });
        },
      },
    );
  
    useEffect(() => {
      getMealRequests({
        variables: {
          requestorId: authId,
          sortByDateDirection: sort,
          ...(filter.length > 0 && { status: filter }),
          limit: 5,
          offset: (currentPage - 1) * 5,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, sort, currentPage]);
  
    const handleEdit = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
      // eslint-disable-next-line no-console
      console.log("edit clicked for item", item.id);
    };
  
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
            {item.time_requested.toLocaleTimeString("en-US")}
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
        label: "Num of Meals",
        renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
          <Text variant="desktop-xs">{item.num_meals}</Text>
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
              <EditIcon
                onClick={handleEdit(item)}
                cursor="pointer"
                _hover={{ color: "primary.blue" }}
              />
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
            <Flex flexDir="column" flex={1} p="8px">
              <Text variant="mobile-button-bold" mb="8px">
                Donor Contact Info:
              </Text>
              <Text variant="mobile-caption-bold">Primary:</Text>
              <Box mb="8px">
                <Text variant="mobile-caption-2">
                  {item.primary_contact.name}
                </Text>
                <Text variant="mobile-caption-2">
                  {item.primary_contact.email}
                </Text>
                <Text variant="mobile-caption-2">
                  {item.primary_contact.phone}
                </Text>
              </Box>
              <Text variant="mobile-caption-bold">Onsite:</Text>
              {item.onsite_staff.map((staff: Contact) => (
                <Box key={staff.email} mb="4px">
                  <Text variant="mobile-caption-2">{staff.name}</Text>
                  <Text variant="mobile-caption-2">{staff.email}</Text>
                  <Text variant="mobile-caption-2">{staff.phone}</Text>
                </Box>
              ))}
            </Flex>
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">Meal Description:</Text>
              <Text variant="mobile-caption-2">{item.meal_description}</Text>
            </Box>
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">Meal Donor Notes:</Text>
              <Text variant="mobile-caption-2">{item.delivery_instructions}</Text>
            </Box>
          </Flex>
        </Collapse>
      ),
    };
  
    if (getMealRequestsError) {
      logGraphQLError(getMealRequestsError);
  
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
  
    if (getMealRequestsLoading || !data) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="200px"
        >
          <LoadingSpinner />
        </Box>
      );
    }
  
    return (
      <Box mt="24px">
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
                onChange={(value) => setSort(value as "ASCENDING" | "DESCENDING")}
              >
                <MenuItemOption value="ASCENDING">Date Ascending</MenuItemOption>
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
                <Text>Filter</Text>
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
                <MenuItemOption value={MealStatus.FULFILLED}>
                  Fulfilled Meals
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
        <Box
          display="flex"
          alignItems="center"
          w="100%"
          h="64px"
          p="12px 16px"
          bgColor="gray.50"
          borderLeft="2px solid"
          borderColor="gray.gray83"
        >
          <Text variant="desktop-body-bold">Meal Requests</Text>
        </Box>
        <CompactTable
          columns={COLUMNS}
          rowOptions={ROW_OPTIONS}
          data={data}
          theme={theme}
          layout={{ custom: true }}
        />
        {getMealRequestsData?.getMealRequestsByRequestorId.length === 0 && (
          <Center h="100px">
            <Text>No meal requests to display</Text>
          </Center>
        )}
        <Box
          display="flex"
          alignItems="center"
          w="100%"
          h="32px"
          p="12px 16px"
          bgColor="gray.50"
          border="1px solid #E2E8F0"
          borderRadius="0px 0px 8px 8px"
          gap="16px"
          color="#4A5568"
          justifyContent="right"
        >
          <Text fontSize="14px">Page: {currentPage}</Text>
          {currentPage === 1 ? (
            <ChevronLeftIcon w="24px" h="24px" color="#A0AEC0" />
          ) : (
            <ChevronLeftIcon
              w="24px"
              h="24px"
              cursor="pointer"
              onClick={() => setCurrentPage(currentPage - 1)}
            />
          )}
          {data?.nodes &&
          data.nodes.length !== 0 &&
          data.nodes.length % 5 === 0 ? (
            <ChevronRightIcon
              w="24px"
              h="24px"
              cursor="pointer"
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          ) : (
            <ChevronRightIcon w="24px" h="24px" color="#A0AEC0" />
          )}
        </Box>
      </Box>
    );
  };

  export default ListView;
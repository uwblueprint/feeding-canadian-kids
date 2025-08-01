import {
  WatchQueryFetchPolicy,
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
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
  useDisclosure,
} from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

import AuthContext from "../../contexts/AuthContext";
import EditMealRequestForm from "../../pages/EditMealRequestForm";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsRequestorVariables,
  MealStatus,
  SortByDateDirection,
} from "../../types/MealRequestTypes";
import { Contact } from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import { Status } from "../../utils/convertMealRequestsToTableNodes";
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
          primaryContact {
            name
            email
            phone
          }
          organizationAddress
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
            primaryContact {
              name
              email
              phone
            }
            organizationName
          }
        }
        donorOnsiteContacts {
          name
          email
          phone
        }
        commitmentDate
        mealDescription
        additionalInfo
      }
    }
  }
`;

const DELETE_MEAL_REQUEST = gql`
  mutation DeleteMealRequest($mealRequestId: ID!, $requestorId: String!) {
    deleteMealRequest(
      mealRequestId: $mealRequestId
      requestorId: $requestorId
    ) {
      mealRequest {
        id
      }
    }
  }
`;

type ASPListViewProps = { authId: string; rowsPerPage?: number };
const ASPListView = ({ authId, rowsPerPage = 10 }: ASPListViewProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

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
  const [sort, setSort] = useState<SortByDateDirection>("ASCENDING");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [
    currentlyEditingMealRequestId,
    setCurrentlyEditingMealRequestId,
  ] = useState<string | undefined>(undefined);
  const apolloClient = useApolloClient();

  const [
    getMealRequests,
    {
      loading: getMealRequestsLoading,
      error: getMealRequestsError,
      data: getMealRequestsData,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsRequestorVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      onCompleted: (results) => {
        // Get the time requested plus one hour
        const newData = {
          nodes: results.getMealRequestsByRequestorId?.map(
            (
              mealRequest: MealRequest,
              index: number,
            ): TABLE_LIBRARY_TYPES.TableNode => {
              const startDate = new Date(mealRequest.dropOffDatetime + "Z");
              const endDate = new Date(startDate);
              endDate.setHours(endDate.getHours() + 1);

              return {
                id: index,
                meal_request_id: mealRequest.id,
                date_requested: new Date(mealRequest.dropOffDatetime + "Z"),
                time_requested_start: startDate,
                time_requested_end: endDate,
                donor_name:
                  mealRequest.donationInfo?.donor.info?.organizationName,
                num_meals: mealRequest.mealInfo?.portions,
                primary_contact:
                  mealRequest.donationInfo?.donor?.info?.primaryContact ?? null,
                onsite_contacts: mealRequest.onsiteContacts,
                donor_onsite_contacts:
                  mealRequest.donationInfo?.donorOnsiteContacts ?? [],
                delivery_notes: mealRequest.deliveryInstructions,
                dietary_restrictions:
                  mealRequest.mealInfo?.dietaryRestrictions ?? "",

                meal_description: mealRequest.donationInfo?.mealDescription,
                meal_donor_notes: mealRequest.donationInfo?.additionalInfo,
                delivery_instructions: mealRequest.deliveryInstructions,
                pending: mealRequest.status === MealStatus.OPEN,
                status: mealRequest.status,
                _hasContent: false,
                nodes: null,
              };
            },
          ),
        };
        setData(newData);
      },
    },
  );

  const [
    itemToDelete,
    setItemToDelete,
  ] = useState<TABLE_LIBRARY_TYPES.TableNode | null>(null);

  function reloadMealRequests(
    fetchPolicy: WatchQueryFetchPolicy = "cache-first",
  ) {
    getMealRequests({
      variables: {
        requestorId: authId,
        sortByDateDirection: sort,
        ...(filter.length > 0 && { status: filter }),
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
      },
      fetchPolicy,
    });
  }

  const [
    deleteMealRequest,
    { loading: deleteMealRequestLoading, error: deleteMealRequestError },
  ] = useMutation(DELETE_MEAL_REQUEST, {
    awaitRefetchQueries: true,
  });

  const handleDelete = async (item: TABLE_LIBRARY_TYPES.TableNode) => {
    try {
      await deleteMealRequest({
        variables: {
          mealRequestId: item.meal_request_id,
          requestorId: authId,
        },
      });
      reloadMealRequests("network-only");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting meal request:", error);
      logPossibleGraphQLError(error, setAuthenticatedUser);
    }
  };

  useEffect(() => {
    reloadMealRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, currentPage]);

  useEffect(() => {
    // check if the query parameter refetch is set to true
    const urlParams = new URLSearchParams(window.location.search);
    const refetch = urlParams.get("refetch");
    if (refetch === "true") {
      apolloClient.cache.evict({ fieldName: "getMealRequestsByRequestorId" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    // eslint-disable-next-line no-console
    setIsEditModalOpen(true);
    setCurrentlyEditingMealRequestId(item.meal_request_id);
  };

  const {
    isOpen: deleteAlertIsOpen,
    onOpen: setDeleteAlertOpen,
    onClose: setDeleteAlertClosed,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
          {item.time_requested_start.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }) +
            " - " +
            item.time_requested_end.toLocaleTimeString("en-US", {
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
      label: "Num of Meals",
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
        if (item.status === MealStatus.FULFILLED) {
          return (
            <Flex
              cursor="pointer"
              justifyContent="flex-end"
              onClick={handleExpand(item)}
            >
              <HStack />
            </Flex>
          );
        }

        if (item.status === MealStatus.UPCOMING) {
          return (
            <Flex cursor="pointer" justifyContent="flex-end">
              <HStack>
                {ids.includes(item.id) ? (
                  <ChevronUpIcon onClick={handleExpand(item)} />
                ) : (
                  <ChevronDownIcon onClick={handleExpand(item)} />
                )}
                <EditIcon
                  onClick={handleEdit(item)}
                  cursor="pointer"
                  _hover={{ color: "primary.blue" }}
                />
              </HStack>
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
              onClick={() => {
                setItemToDelete(item);
                setDeleteAlertOpen();
              }}
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
          flexWrap="wrap"
        >
          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-button-bold" mb="8px">
              Donor Contact Info:
            </Text>
            <Text variant="mobile-caption-bold">Primary:</Text>
            <Box mb="8px">
              <Text variant="mobile-caption-2">
                {item.primary_contact?.name ?? ""}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact?.email ?? ""}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact?.phone ?? ""}
              </Text>
            </Box>
            <Text variant="mobile-caption-bold">Meal Donor Contacts</Text>
            {item.donor_onsite_contacts?.map((staff: Contact) => (
              <Box key={staff.email} mb="4px">
                <Text variant="mobile-caption-2">{staff.name}</Text>
                <Text variant="mobile-caption-2">{staff.email}</Text>
                <Text variant="mobile-caption-2">{staff.phone}</Text>
              </Box>
            )) ?? []}
          </Flex>

          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-button-bold" mb="8px">
              Donor Provided Info:
            </Text>
            <Box flex={1} p="8px" pl={0}>
              <Text variant="mobile-button-bold">Meal Description</Text>
              <Text variant="mobile-caption-2">{item.meal_description}</Text>
            </Box>
            <Box flex={1} p="8px" pl={0}>
              <Text variant="mobile-button-bold">Donor Provided Notes:</Text>
              <Text variant="mobile-caption-2">{item.meal_donor_notes}</Text>
            </Box>
          </Flex>

          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-button-bold" mb="8px">
              Your Request:
            </Text>
            <Box flex={1} p="8px" pl={0}>
              <Text variant="mobile-button-bold">Your Onsite Staff</Text>
              {item.onsite_contacts?.map((staff: Contact) => (
                <Box key={staff.email} mb="4px">
                  <Text variant="mobile-caption-2">{staff.name}</Text>
                  <Text variant="mobile-caption-2">{staff.email}</Text>
                  <Text variant="mobile-caption-2">{staff.phone}</Text>
                </Box>
              )) ?? []}
            </Box>
            <Box flex={1} p="8px" pl={0}>
              <Text variant="mobile-button-bold">Dietary Restrictions</Text>
              <Text variant="mobile-caption-2">
                {item.dietary_restrictions}
              </Text>
            </Box>
            <Box flex={1} p="8px" pl={0}>
              <Text variant="mobile-button-bold">Delivery Instructions</Text>
              <Text variant="mobile-caption-2">
                {item.delivery_instructions}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Collapse>
    ),
  };

  if (getMealRequestsError) {
    logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);

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
    <>
      <AlertDialog
        isOpen={deleteAlertIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={setDeleteAlertClosed}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Meal Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cannot undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={setDeleteAlertClosed}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (itemToDelete) handleDelete(itemToDelete);
                  setDeleteAlertClosed();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {currentlyEditingMealRequestId ? (
        <EditMealRequestForm
          open={isEditModalOpen}
          onClose={(newMealRequest) => {
            setIsEditModalOpen(false);
            setCurrentlyEditingMealRequestId(undefined);
            if (newMealRequest !== undefined) {
              reloadMealRequests();
            }
          }}
          mealRequestId={currentlyEditingMealRequestId}
          isEditDonation={false}
        />
      ) : (
        ""
      )}
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
                {/* <MenuItemOption value={MealStatus.CANCELLED}>
                Cancelled Meals
              </MenuItemOption> */}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
        <ListView
          columns={COLUMNS}
          rowOptions={ROW_OPTIONS}
          data={data}
          loading={getMealRequestsLoading}
          requestType="Meal Requests"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </>
  );
};

export default ASPListView;

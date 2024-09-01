import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useEffect, useState } from "react";
import { BsFilter, BsReplyAll } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { ADMIN_MEAL_REQUESTS_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsDonorVariables,
  MealRequestsRequestorVariables,
  MealRequestsVariables,
  MealStatus,
} from "../../types/MealRequestTypes";
import { Contact } from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import { Status, convertMealRequestsToTableNodes, formatDateTimeFully } from "../../utils/convertMealRequestsToTableNodes";
import ListView from "../common/ListView";

const GET_MEAL_REQUESTS = gql`
  query GetMealRequests(
    $adminId: ID!
    $minDropOffDate: Date
    $maxDropOffDate: Date
    $status: [MealStatus]
    $offset: Int
    $limit: Int
    $sortByDateDirection: SortDirection
  ) {
    getMealRequests(
      adminId: $adminId
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
          email
          organizationName
          organizationAddress
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
            primaryContact {
              name
              email
              phone
            }
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
          email
          organizationName
          organizationAddress
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
            primaryContact {
              name
              email
              phone
            }
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
          email
          organizationName
          organizationAddress
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
            primaryContact {
              name
              email
              phone
            }
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

const CANCEL_DONATION = gql`
  mutation CancelDonation($mealRequestId: ID!, $requestorId: String!) {
    cancelDonation(mealRequestId: $mealRequestId, requestorId: $requestorId) {
      mealRequest {
        id
      }
    }
  }
`;


const UnmatchDeleteModal = ({
  isOpen,
  onClose,
  mealRequestId,
  isUpcoming,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  mealRequestId: string;
  isUpcoming: boolean;
  refetch: () => void;
}): React.ReactElement => {
  const toast = useToast();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [deleteMealRequest] = useMutation<{
    deleteMealRequest: { mealRequestId: string; requestorId: string };
  }>(DELETE_MEAL_REQUEST);
  const [cancelDonation] = useMutation<{
    cancelDonation: { mealRequestId: string; requestorId: string };
  }>(CANCEL_DONATION);
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const onUnmatch = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await cancelDonation({
        variables: {
          mealRequestId,
          requestorId: authenticatedUser?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Donation cancelled successfully!",
          status: "success",
          isClosable: true,
        });
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      toast({
        title: "Failed to cancel donation. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
    refetch();
    onClose();
    await setIsSubmitLoading(false);
  };

  const onDelete = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await deleteMealRequest({
        variables: {
          mealRequestId,
          requestorId: authenticatedUser?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Deleted meal request successfully!",
          status: "success",
          isClosable: true,
        });
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      toast({
        title: "Failed to delete meal request. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
    refetch();
    onClose();
    await setIsSubmitLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent p="0.5%">
        <ModalHeader fontSize="md">
          {isUpcoming ? "Unmatch?" : "Delete?"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isUpcoming
            ? "This action will unpair the meal donor from the ASP meal request.\nThe ASP meal request will be able to be fulfilled by other meal donors. Make sure to inform the ASP and Meal Donor manually as no notification is sent to them!!"
            : "This action will delete the pending meal request from the portal.\nThis means that the meal request will no longer exist. Make sure to inform the ASP manually as no notification is sent to them!"}
        </ModalBody>
        <ModalFooter>
          {isUpcoming ? (
            <ChakraButton
              width="25%"
              color="text.white"
              bgColor="text.red"
              _hover={{
                bgColor: "background.darkred",
              }}
              onClick={() => {
                onUnmatch();
              }}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? <Spinner /> : "Unmatch"}
            </ChakraButton>
          ) : (
            <ChakraButton
              width="25%"
              color="text.white"
              bgColor="text.red"
              _hover={{
                bgColor: "background.darkred",
              }}
              onClick={() => {
                onDelete();
              }}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? <Spinner /> : "Delete"}
            </ChakraButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type AdminListViewProps = {
  rowsPerPage?: number;
  donorId?: string;
  aspId?: string;
};

const AdminListView = ({
  rowsPerPage = 10,
  donorId,
  aspId,
}: AdminListViewProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
  }>();
  const [filter, setFilter] = useState<Array<MealStatus>>([]);
  const [sort, setSort] = useState<"ASCENDING" | "DESCENDING">("ASCENDING");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [mealRequestId, setMealRequestId] = useState<string>("");
  const [isUpcoming, setIsUpcoming] = useState<boolean>(false);
  const [shouldReload, setShouldReload] = useState(false);
  const navigate = useNavigate();

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const [
    getMealRequests,
    { loading: getMealRequestsLoading, error: getMealRequestsError },
  ] = useLazyQuery<MealRequestsData, MealRequestsVariables>(GET_MEAL_REQUESTS, {
    onCompleted: (results) => {
      setData({
        nodes: convertMealRequestsToTableNodes(results.getMealRequests),
      });
    },
    onError: (error) => {
      logPossibleGraphQLError(error, setAuthenticatedUser);
    },
  });
  logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);

  const [
    getMealRequestsByRequestorId,
    {
      loading: getMealRequestsRequestorLoading,
      error: getMealRequestsRequestorError,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsRequestorVariables>(
    GET_MEAL_REQUESTS_BY_REQUESTOR_ID,
    {
      onCompleted: (results) => {
        setData({
          nodes: convertMealRequestsToTableNodes(
            results.getMealRequestsByRequestorId,
          ),
        });
      },
      onError: (error) => {
        logPossibleGraphQLError(error, setAuthenticatedUser);
      },
    },
  );
  logPossibleGraphQLError(getMealRequestsRequestorError, setAuthenticatedUser);

  const [
    getMealRequestsByDonorId,
    { loading: getMealRequestsDonorLoading, error: getMealRequestsDonorError },
  ] = useLazyQuery<MealRequestsData, MealRequestsDonorVariables>(
    GET_MEAL_REQUESTS_BY_DONOR_ID,
    {
      onCompleted: (results) => {
        setData({
          nodes: convertMealRequestsToTableNodes(
            results.getMealRequestsByDonorId,
          ),
        });
      },
      onError: (error) => {
        logPossibleGraphQLError(error, setAuthenticatedUser);
      },
    },
  );
  logPossibleGraphQLError(getMealRequestsDonorError, setAuthenticatedUser);

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
        fetchPolicy: shouldReload ? "network-only" : "cache-first",
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
        fetchPolicy: shouldReload ? "network-only" : "cache-first",
      });
    } else if (authenticatedUser) {
      getMealRequests({
        variables: {
          adminId: authenticatedUser?.id,
          sortByDateDirection: sort,
          ...(filter.length > 0 && { status: filter }),
          limit: rowsPerPage,
          offset: (currentPage - 1) * rowsPerPage,
        },
        fetchPolicy: shouldReload ? "network-only" : "cache-first",
      });
    }
  }

  useEffect(() => {
    if (shouldReload) {
      reloadMealRequests();
      setShouldReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReload]);

  useEffect(() => {
    reloadMealRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, currentPage, authenticatedUser, aspId, donorId]);

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
            <Text variant="mobile-button-bold">ASP Login Email</Text>
            <Text variant="mobile-caption-2">{item.asp_login_email}</Text>
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
              <Text variant="mobile-button-bold">Donor Name</Text>
              <Text variant="mobile-caption-2">{item.donor_name}</Text>
              <Text variant="mobile-button-bold">Donor Login Email</Text>
              <Text variant="mobile-caption-2">{item.asp_login_email}</Text>
              <Text variant="mobile-button-bold">Donor Primary Contact</Text>
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
              <Text variant="mobile-button-bold">Onsite Donor Contacts</Text>
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
              <Text variant="mobile-button-bold">Donor Meal Description</Text>
              <Text variant="mobile-caption-2">
                {formatDateTimeFully(item.donation_meal_description)}
              </Text>
              <Text variant="mobile-button-bold">
                Donor Additional Information{" "}
              </Text>
              <Text variant="mobile-caption-2">
                {formatDateTimeFully(item.additional_donation_info)}
              </Text>
            </Box>
          ) : null}

          {item.status !== MealStatus.FULFILLED && (
            <Flex alignItems="end">
              {item.status === MealStatus.UPCOMING ? (
                <ChakraButton
                  width="100%"
                  color="text.red"
                  bgColor="text.white"
                  border="2px solid"
                  borderColor="text.red"
                  _hover={{
                    bgColor: "gray.gray83",
                  }}
                  onClick={() => {
                    setMealRequestId(item.meal_request_id);
                    setIsUpcoming(true);
                    onOpen();
                  }}
                >
                  Unmatch
                </ChakraButton>
              ) : (
                <ChakraButton
                  width="100%"
                  color="text.red"
                  bgColor="text.white"
                  border="2px solid"
                  borderColor="text.red"
                  _hover={{
                    bgColor: "gray.gray83",
                  }}
                  onClick={() => {
                    setMealRequestId(item.meal_request_id);
                    setIsUpcoming(false);
                    onOpen();
                  }}
                >
                  Delete
                </ChakraButton>
              )}
            </Flex>
          )}
        </Flex>
      </Collapse>
    ),
  };

  if (
    getMealRequestsError ||
    getMealRequestsRequestorError ||
    getMealRequestsDonorError
  ) {
    if (getMealRequestsError) {
      logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);
    } else if (getMealRequestsRequestorError) {
      logPossibleGraphQLError(
        getMealRequestsRequestorError,
        setAuthenticatedUser,
      );
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
        {aspId || donorId ? 
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
            onClick={() => {
              navigate(ADMIN_MEAL_REQUESTS_PAGE, { replace: false } );
            }}
          >
            <Flex gap="2px">
              <BsReplyAll />
              <Text>
                View All Meal Requests
              </Text>
            </Flex>
          </MenuButton>
        </Menu> : null}
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
                Open Meals
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
        loading={
          getMealRequestsLoading ||
          getMealRequestsRequestorLoading ||
          getMealRequestsDonorLoading
        }
        requestType="Meal Requests"
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <UnmatchDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        mealRequestId={mealRequestId}
        isUpcoming={isUpcoming}
        refetch={() => {
          setShouldReload(true);
        }}
      />
    </Box>
  );
};

export default AdminListView;

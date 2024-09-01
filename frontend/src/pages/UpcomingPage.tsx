import {
  InMemoryCache,
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  AtSignIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmailIcon,
  HamburgerIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Button as ChakraButton,
  Flex,
  HStack,
  Select,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Td,
  Text,
  Tr,
  VStack,
  Wrap,
  useMediaQuery,
} from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useEffect, useState } from "react";
import {
  IoBanOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoRestaurant,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";

import Logout from "../components/auth/Logout";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import ListView from "../components/common/ListView";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MealDonorListView from "../components/mealrequest/MealDonorListView";
import { CREATE_MEAL_REQUEST_PAGE, LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsDonorVariables,
  MealStatus,
  SortByDateDirection,
} from "../types/MealRequestTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import { convertMealRequestsToTableNodes } from "../utils/convertMealRequestsToTableNodes";

const GET_MEAL_REQUESTS_BY_ID = gql`
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
          organizationName
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

type ButtonProps = { text: string; path: string };

type Staff = {
  name: string;
  email: string;
  phone: string;
};

type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  extendedProps: {
    mealRequest: MealRequest | undefined;
  };
  backgroundColor: string;
  borderColor: string;
  borderRadius: string;
};

type UpcomingEvents = UpcomingEvent[];

const NavButton = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export const UpcomingCard = ({ event, setShouldReload }: { event: UpcomingEvent, setShouldReload : (_: boolean) => void}) => {
  const { mealRequest } = event.extendedProps;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [
    currentlyEditingMealRequestId,
    setCurrentlyEditingMealRequestId,
  ] = useState<string | undefined>(undefined);

  const handleEditDonation = (meal: MealRequest | undefined) => () => {
    setIsEditModalOpen(true);
    setCurrentlyEditingMealRequestId(meal?.id);
  };

  return (
    <div>
      {currentlyEditingMealRequestId ? (
        <EditMealRequestForm
          open={isEditModalOpen}
          onClose={(newMealRequest) => {
            setIsEditModalOpen(false);
            setCurrentlyEditingMealRequestId(undefined);
            setShouldReload(true);
          }}
          mealRequestId={currentlyEditingMealRequestId}
          isEditDonation
        />
      ) : (
        ""
      )}
      <Card padding={3} variant="outline">
        <Flex
          direction={["column", "row"]}
          justifyContent="space-around"
          alignItems="center"
        >
          <VStack padding={1}>
            <Text fontSize="md">
              {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                formatDate(mealRequest!.dropOffDatetime + "Z")
              }
            </Text>
            <Text fontSize="20px">
              {new Date(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mealRequest!.dropOffDatetime + "Z",
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }) ?? ""}
            </Text>
            <HStack>
              <IoRestaurant height={20} width={20} />
              <Text fontSize="20px">
                {mealRequest?.mealInfo.portions}{" "}
                {mealRequest?.mealInfo.portions === 1 ? "meal" : "meals"}
              </Text>
            </HStack>
            {"\n"}
            <ChakraButton onClick={handleEditDonation(mealRequest)}>
              Edit My Donation
            </ChakraButton>
          </VStack>

          <VStack alignItems="left" padding={6} alignSelf="start">
            <HStack alignItems="top">
              <IoPersonOutline />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>
                    ASP Name:
                    <br />
                  </strong>
                  {mealRequest?.requestor.info?.organizationName}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="top">
              <IoLocationOutline />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>
                    Location:
                    <br />
                  </strong>
                  {mealRequest?.requestor.info?.organizationAddress}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="top" gap={0}>
              <IoPersonOutline />
              <VStack alignItems="left" gap={0} spacing={0}>
                <Text variant="mobile-button-bold">ASP Primary Contact</Text>
                <Text fontSize="xs">{mealRequest?.requestor.info?.primaryContact.name}</Text>
                <Text fontSize="xs">{mealRequest?.requestor.info?.primaryContact.email}</Text>
                <Text fontSize="xs">{mealRequest?.requestor.info?.primaryContact.name}</Text>
              </VStack>
            </HStack>

            <HStack alignItems="top">
              <IoPersonOutline />
              <VStack alignItems="left" gap={0} spacing={1}>
                <Text fontSize="xs">
                  <strong>ASP Onsite Staff:</strong>
                </Text>
                {mealRequest?.onsiteContacts.map((staffMember) => (
                <VStack alignItems="left" gap={0} spacing={0} key={staffMember.name + staffMember.email}>
                  <Text fontSize="xs">{staffMember.name}</Text>
                  <Text fontSize="xs">{staffMember.email}</Text>
                  <Text fontSize="xs">{staffMember.phone}</Text>
                  </VStack>
                ))}

              </VStack>
            </HStack>

            <HStack alignItems="top">
              <IoBanOutline />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>Dietary Restrictions: </strong>
                  <br />
                  {mealRequest?.mealInfo.dietaryRestrictions}
                </Text>
              </VStack>
            </HStack>
            <HStack alignItems="top">
              <EmailIcon />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>Delivery Notes:</strong>
                  <br />
                  {mealRequest?.deliveryInstructions}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <VStack padding={6} alignItems="left" justifyContent="start" alignSelf="start">
            <HStack alignItems="top" gap={0}>
              <IoPersonOutline />
              <VStack alignItems="left" gap={0} spacing={0}>
                <Text variant="mobile-button-bold">Your Primary Contact</Text>
                <Text fontSize="xs">{mealRequest?.donationInfo?.donor?.info?.primaryContact?.name}</Text>
                <Text fontSize="xs">{mealRequest?.donationInfo?.donor?.info?.primaryContact?.email}</Text>
                <Text fontSize="xs">{mealRequest?.donationInfo?.donor?.info?.primaryContact?.phone}</Text>
              </VStack>
            </HStack>

            <HStack alignItems="top">
              <IoPersonOutline />
              <VStack alignItems="left" gap={0} spacing={1}>
                <Text fontSize="xs">
                  <strong>Your Onsite Staff:</strong>
                </Text>
                {mealRequest?.donationInfo?.donorOnsiteContacts?.map((staffMember) => (
                <VStack alignItems="left" gap={0} spacing={0} key={staffMember.name + staffMember.email}>
                  <Text fontSize="xs">{staffMember.name}</Text>
                  <Text fontSize="xs">{staffMember.email}</Text>
                  <Text fontSize="xs">{staffMember.phone}</Text>
                  </VStack>
                ))}
              </VStack>
            </HStack>
            <HStack alignItems="top">
              <EmailIcon />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>Your meal description</strong>
                  <br />
                  {mealRequest?.donationInfo.mealDescription}
                </Text>
              </VStack>
            </HStack>
            <HStack alignItems="top">
              <EmailIcon />
              <VStack alignItems="left">
                <Text fontSize="xs">
                  <strong>Your additional information</strong>
                  <br />
                  {mealRequest?.donationInfo?.additionalInfo}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Flex>
      </Card>
    </div>
  );
};

const UpcomingPage = (): React.ReactElement => {
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().split("T")[0];

  const [tabSelected, setTabSelected] = useState(0);

  const [
    sortByDateDirection,
    setSortByDateDirection,
  ] = useState<SortByDateDirection>("ASCENDING");

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shouldReload, setShouldReload] = useState(false);

  const [
    upcomingMealRequests,
    setUpcomingMealRequests,
  ] = useState<UpcomingEvents>([]);
  const [completedMealRequests, setCompletedMealRequests] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
  }>();

  const rowsPerPage = 10;

  const [
    getUpcomingMealRequests,
    {
      data: getUpcomingMealRequestsData,
      error: getUpcomingMealRequestsError,
      loading: getUpcomingMealRequestsLoading,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsDonorVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      onCompleted: (results) => {
        setUpcomingMealRequests(
          results?.getMealRequestsByDonorId.map((mealRequest: MealRequest) => {
            return {
              id: mealRequest.id,
              title: `${new Date(
                mealRequest.dropOffDatetime + "Z",
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}`,
              date: mealRequest.dropOffDatetime + "Z",
              extendedProps: { mealRequest },
              backgroundColor: "#3BA948",
              borderColor: "#3BA948",
              borderRadius: "10%",
            };
          }) ?? [],
        );
      },
    },
  );

  const [
    getCompletedMealRequests,
    {
      loading: getCompletedMealRequestsLoading,
      error: getCompletedMealRequestsError,
      data: getCompletedMealRequestsData,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsDonorVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      onCompleted: (results) => {
        setCompletedMealRequests({
          nodes: 
          convertMealRequestsToTableNodes(
           results.getMealRequestsByDonorId
          )
        });
      },
    },
  );

  function reloadUpcomingMealRequests() {
    getUpcomingMealRequests({
      variables: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        donorId: authenticatedUser!.id,
        limit: 3,
        offset,
        sortByDateDirection,
        minDropOffDate: formattedTime,
      },
    });
    logPossibleGraphQLError(getUpcomingMealRequestsError, setAuthenticatedUser);
  }

  function reloadCompletedMealRequests() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    getCompletedMealRequests({
      variables: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        donorId: authenticatedUser!.id,
        sortByDateDirection,
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
        status: [MealStatus.UPCOMING, MealStatus.FULFILLED],
        maxDropOffDate: yesterday.toISOString().split("T")[0],
      },
    });
    logPossibleGraphQLError(
      getCompletedMealRequestsError,
      setAuthenticatedUser,
    );
  }

  // Sorting, changing tabs
  useEffect(() => {
    if (tabSelected === 0) {
      reloadUpcomingMealRequests();
    } else {
      reloadCompletedMealRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabSelected, sortByDateDirection]);

  // Card pagination
  useEffect(() => {
    if (upcomingMealRequests) {
      reloadUpcomingMealRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // List pagination
  useEffect(() => {
    if (completedMealRequests) {
      reloadCompletedMealRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (shouldReload) {
      reloadCompletedMealRequests();
      reloadUpcomingMealRequests();
      setShouldReload(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReload]);

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  return (
    <Box
      marginLeft={["20px", "20px", "150px", "150px"]}
      marginRight={["20px", "20px", "150px", "150px"]}
      marginTop={["50px", "150px"]}
      marginBottom={["50px", "150px"]}
      textAlign="left"
    >
      <Text
        fontFamily="Dimbo"
        fontStyle="normal"
        fontWeight="400"
        fontSize={["26px", "40px"]}
        pb={["8px", "10px"]}
      >
        {tabSelected === 0 ? "Upcoming" : "Completed"} Donations
      </Text>

      {
        // Not entirely sure why this was here...
        /* <Flex
        justifyContent={["center", "flex-end"]}
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
      >
        <NavButton text="+ Create Request" path={CREATE_MEAL_REQUEST_PAGE} />
      </Flex> */
      }

      <Tabs
        variant="unstyled"
        onChange={() => {
          setOffset(0);
          if (tabSelected === 0) {
            setTabSelected(1);
          } else {
            setTabSelected(0);
          }
        }}
        defaultIndex={tabSelected}
      >
        <TabList>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              {/* <CalendarIcon boxSize={4} mr={2} /> */}
              Upcoming
            </Text>
          </Tab>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              {/* <HamburgerIcon boxSize={4} mr={2} /> */}
              Completed
            </Text>
          </Tab>
          <Select
            value={sortByDateDirection}
            onChange={(e) => {
              const { target } = e;
              if (target.type === "select-one") {
                const selectValue = target.selectedOptions[0].value;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setSortByDateDirection(selectValue);
              }
            }}
            fontSize="xs"
            placeholder="Select option"
            width={60}
            pl={5}
          >
            <option value="DESCENDING">Newest to Oldest</option>
            <option value="ASCENDING">Oldest to Newest</option>
          </Select>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="#272D77"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            {getUpcomingMealRequestsLoading && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="200px"
              >
                <LoadingSpinner />
              </Box>
            )}
            {!getUpcomingMealRequestsLoading && (
              <>
                <Stack direction="column">
                  {upcomingMealRequests?.map((event) => (
                    <UpcomingCard event={event} key={event.id} setShouldReload={setShouldReload}/>
                  ))}
                </Stack>
                <HStack>
                  <Button
                    leftIcon={<ChevronLeftIcon />}
                    colorScheme="black"
                    variant="ghost"
                    onClick={() => {
                      if (offset > 0) {
                        setOffset(offset - 3);
                      }
                    }}
                  />
                  <Text>{offset / 3 + 1}</Text>
                  <Button
                    rightIcon={<ChevronRightIcon />}
                    colorScheme="black"
                    variant="ghost"
                    onClick={() => {
                      if (
                        upcomingMealRequests &&
                        upcomingMealRequests.length >= offset
                      ) {
                        setOffset(offset + 3);
                      }
                    }}
                  />
                </HStack>
              </>
            )}
          </TabPanel>
          <TabPanel>
            <MealDonorListView
              completedMealRequests={completedMealRequests}
              completedMealRequestsLoading={getCompletedMealRequestsLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UpcomingPage;

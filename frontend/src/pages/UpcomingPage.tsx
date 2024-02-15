import { gql, useMutation, useQuery } from "@apollo/client";
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
import React, { useContext, useEffect, useState } from "react";
import {
  IoBanOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoRestaurant,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

import Logout from "../components/auth/Logout";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { CREATE_MEAL_REQUEST_PAGE, LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsVariables,
  MealStatus,
} from "../types/MealRequestTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";

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

type ButtonProps = { text: string; path: string };

type Staff = {
  name: string;
  email: string;
  phone: string;
};

type MealRequest1 = {
  date: Date;
  onsiteStaff: Staff[];
  dropOffTime: Date;
  dropOffLocation: string;
  deliveryInstructions: string;
};

const NavButton = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const UpcomingPage = (): React.ReactElement => {
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [offset, setOffset] = useState(0);
  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().split('T')[0];

  const [filter, setFilter] = useState("DESCENDING");
  const [tabSelected, setTabSelected] = useState(0);

  const {
    data: upcomingMealRequests,
    error: getUpdatedMealRequestsError,
    loading: getUpdatedMealRequestsLoading,
  } = useQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      variables: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestorId: authenticatedUser!.id,
        limit: 3,
        offset,
        sortByDateDirection:
          filter === "DESCENDING" ? "DESCENDING" : "ASCENDING",
        minDropOffDate: formattedTime,
      },
    },
  );

  if (!authenticatedUser) {
    console.log("return");
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const realEvents =
    mealRequests?.getMealRequestsByRequestorId.map(
      (mealRequest: MealRequest) => {
        const date = new Date(
          mealRequest.dropOffDatetime.toString().split("T")[0],
        );
        const dateParts = date
          .toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .split(",")[0]
          .split("/");
        const realDate = dateParts[2] + "-" + dateParts[0] + "-" + dateParts[1];
        return {
          title: `${new Date(
            mealRequest.dropOffDatetime.toLocaleString(),
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}`,
          date: realDate,
          extendedProps: { mealRequest },
          backgroundColor: "#3BA948",
          borderColor: "#3BA948",
          borderRadius: "10%",
        };
      },
    ) ?? [];

  if (getMealRequestsLoading) {
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100%"
      h="200px"
    ></Box>;
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
        Upcoming Donations
      </Text>

      <Text
        fontFamily="Inter"
        fontWeight="400"
        fontSize={["12px", "16px"]}
        pb="10px"
      >
        My upcoming meal donations
      </Text>

      <Flex
        justifyContent={["center", "flex-end"]}
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
      >
        <NavButton text="+ Create Request" path={CREATE_MEAL_REQUEST_PAGE} />
      </Flex>

      {/* tabs */}
      <Tabs variant="unstyled">
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
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="#272D77"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            {isWebView && (
              <Stack direction="column">
                {realEvents.reverse().map((event) => (
                  <div
                    style={{
                      width: "55%",
                    }}
                  >
                    {/* <Text fontSize="md" padding={5} paddingTop={1}>
                      Upcoming Delivery
                    </Text> */}
                    <Card padding={3} variant="outline">
                      <HStack dir="row">
                        <VStack padding={10}>
                          <Text fontSize="md">
                            {formatDate(
                              event.extendedProps.mealRequest.dropOffDatetime
                                .toLocaleString()
                                .split("T")[0],
                            )}
                          </Text>
                          <Text fontSize="20px">
                            {new Date(
                              event.extendedProps.mealRequest.dropOffDatetime.toLocaleString(),
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                          <HStack>
                            <IoRestaurant height={20} width={20}/>
                            <Text fontSize="20px">
                            {event.extendedProps.mealRequest.mealInfo.portions}{" "}
                            {event.extendedProps.mealRequest.mealInfo
                              .portions === 1
                              ? "meal"
                              : "meals"}
                          </Text>
                          </HStack>
                          {"\n"}
                          <ChakraButton>Edit My Donation</ChakraButton>
                          
                        </VStack>
                        <VStack alignItems="left" padding={6}>
                          <HStack alignItems="top">
                            <IoLocationOutline />
                            <VStack alignItems="left">
                              <Text fontSize="xs">
                                <strong>
                                  Location:
                                  <br />
                                </strong>
                                {
                                  event.extendedProps.mealRequest
                                    .dropOffLocation
                                }
                              </Text>
                            </VStack>
                          </HStack>

                          <HStack alignItems="top">
                            <IoPersonOutline />
                            <VStack alignItems="left">
                              <Text fontSize="xs">
                                <strong>ASP Onsite Staff:</strong>
                              </Text>
                              {event.extendedProps.mealRequest.onsiteStaff.map(
                                (staffMember) => (
                                  <>
                                    <Text fontSize="xs">
                                      {staffMember.name}
                                    </Text>
                                    <Text fontSize="xs">
                                      {staffMember.email}
                                    </Text>
                                    <Text fontSize="xs">
                                      {staffMember.phone}
                                    </Text>
                                  </>
                                ),
                              )}
                            </VStack>
                          </HStack>

                        <HStack alignItems="top">
                            <IoBanOutline />
                          <VStack alignItems="left">
                            <Text fontSize="xs">
                              <strong>Dietary Restrictions: </strong>
                              <br />
                              {
                                event.extendedProps.mealRequest.mealInfo
                                  .dietaryRestrictions
                              }
                            </Text>
                          </VStack>
                          </HStack>
                          <HStack alignItems="top">
                                    <EmailIcon />
                          <VStack alignItems="left">
                            <Text fontSize="xs">
                              <strong>Delivery Notes:</strong>
                              <br />
                              {
                                event.extendedProps.mealRequest
                                  .deliveryInstructions
                              }
                            </Text>
                          </VStack>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Card>
                  </div>
                ))}
              </Stack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default UpcomingPage;

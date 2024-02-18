import { gql, useMutation, useQuery } from "@apollo/client";
import {
  AtSignIcon,
  CalendarIcon,
  EmailIcon,
  HamburgerIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Button as ChakraButton,
  Flex,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Td,
  Text,
  Tr,
  Wrap,
  useMediaQuery,
} from "@chakra-ui/react";
// eslint-disable-next-line import/order
import { b2 } from "@fullcalendar/core/internal-common";
// eslint-disable-next-line import/order
import dayGridPlugin from "@fullcalendar/daygrid";
// eslint-disable-next-line import/order
import FullCalendar from "@fullcalendar/react";
import React, { useContext, useState } from "react";
import {
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

import MealRequestForm from "./MealRequestForm";

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

const SAMPLE_ONSITE_STAFF_1: Staff = {
  name: "John D.",
  email: "john@email.com",
  phone: "123-456-7890",
};

const SAMPLE_ONSITE_STAFF_2: Staff = {
  name: "Alice F.",
  email: "alice@email.com",
  phone: "123-456-7890",
};

const SAMPLE_MEAL_REQUEST_1: MealRequest1 = {
  date: new Date(2023, 7, 18, 12, 30, 0),
  onsiteStaff: [SAMPLE_ONSITE_STAFF_1, SAMPLE_ONSITE_STAFF_2],
  dropOffTime: new Date(2023, 7, 18, 12, 30, 0),
  dropOffLocation: "20 Main St.",
  deliveryInstructions: "Leave at the main entrance.",
};

const SAMPLE_MEAL_REQUEST_2: MealRequest1 = {
  date: new Date(2023, 7, 22, 12, 30, 0),
  onsiteStaff: [SAMPLE_ONSITE_STAFF_1, SAMPLE_ONSITE_STAFF_2],
  dropOffTime: new Date(2023, 7, 22, 12, 30, 0),
  dropOffLocation: "20 Main St.",
  deliveryInstructions: "Leave at the main entrance.",
};

const NavButton = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const Calandar = (): React.ReactElement => {
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const {
    data: mealRequests,
    error: getMealRequestsError,
    loading: getMealRequestsLoading,
  } = useQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      variables: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        requestorId: authenticatedUser!.id,
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
        const realDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
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
    >
      <LoadingSpinner />
    </Box>;
  }

  return (
    <Box
      marginLeft={["20px", "20px", "150px", "150px"]}
      marginRight={["20px", "20px", "150px", "150px"]}
      marginTop={["50px", "150px"]}
      marginBottom={["50px", "150px"]}
      textAlign="center"
    >
      <Text
        fontFamily="Dimbo"
        fontStyle="normal"
        fontWeight="400"
        fontSize={["26px", "40px"]}
        pb={["8px", "10px"]}
      >
        Your Dashboard
      </Text>

      <Text
        fontFamily="Inter"
        fontWeight="400"
        fontSize={["12px", "16px"]}
        pb="10px"
      >
        Use this page to see your upcoming food deliveries.
      </Text>

      <Flex
        justifyContent={["center", "flex-end"]}
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
      >
        <NavButton text="+ Create Request" path={CREATE_MEAL_REQUEST_PAGE} />
      </Flex>

      {/* tabs */}
      <Tabs colorScheme="black">
        <TabList>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              <CalendarIcon boxSize={4} mr={2} />
              Calendar
            </Text>
          </Tab>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              <HamburgerIcon boxSize={4} mr={2} />
              List
            </Text>
          </Tab>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              Test Buttons
            </Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {isWebView && (
              <Stack direction="row">
                <div style={{ width: "100%" }}>
                  <FullCalendar
                    headerToolbar={{
                      left: "prev",
                      center: "title",
                      right: "next",
                    }}
                    themeSystem="Simplex"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={realEvents}
                    eventClick={(info) => {
                      if (
                        selectedMealRequest ===
                        info.event.extendedProps.mealRequest
                      ) {
                        setSelectedMealRequest(undefined);
                      } else {
                        setSelectedMealRequest(
                          info.event.extendedProps.mealRequest,
                        );
                      }
                    }}
                  />
                </div>
                {selectedMealRequest && (
                  <div
                    style={{
                      width: "30%",
                      margin: "20px",
                      marginTop: "0px",
                      marginRight: "0px",
                    }}
                  >
                    <Text fontSize="md" padding={5} paddingTop={1}>
                      Upcoming Delivery
                    </Text>
                    <Card padding={3} width={80} variant="outline">
                      <HStack
                        padding={3}
                        style={{ justifyContent: "space-between" }}
                      >
                        <Text>
                          {formatDate(
                            selectedMealRequest.dropOffDatetime
                              .toLocaleString()
                              .split("T")[0],
                          )}
                        </Text>
                        <Text>
                          {new Date(
                            selectedMealRequest.dropOffDatetime.toLocaleString(),
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </Text>
                      </HStack>
                      <Table
                        variant="unstyled"
                        size="md"
                        __css={{ "table-layout": "fixed", width: "full" }}
                      >
                        <Tr>
                          <Td width={2}>
                            <IoLocationOutline />
                          </Td>
                          <Td>
                            <Text>
                              <strong>
                                Location:
                                <br />
                              </strong>
                              {selectedMealRequest.dropOffLocation}
                            </Text>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td width={2}>
                            <IoPersonOutline />
                          </Td>
                          <Td>
                            <Text>
                              <strong>Onsite Staff:</strong>
                            </Text>
                            {selectedMealRequest.onsiteStaff.map(
                              (staffMember) => (
                                <>
                                  <Text>{staffMember.name}</Text>
                                  <Text>{staffMember.email}</Text>
                                  <Text>{staffMember.phone}</Text>
                                </>
                              ),
                            )}
                          </Td>
                        </Tr>

                        <Tr>
                          <Td width={2}>
                            <EmailIcon />
                          </Td>
                          <Td>
                            <Text>
                              <strong>Delivery Notes:</strong>
                              <br />
                              {selectedMealRequest.deliveryInstructions}
                            </Text>
                          </Td>
                        </Tr>
                        <HStack padding={3} width={40}>
                          <Text>Meal Information</Text>
                        </HStack>
                        <Tr>
                          <Td width={2}>
                            <IoInformationCircleOutline />
                          </Td>
                          <Td>
                            <Text>
                              <strong>Meal Description: </strong>
                              <br />
                              {selectedMealRequest.mealInfo.portions}{" "}
                              {selectedMealRequest.mealInfo.dietaryRestrictions}{" "}
                              {selectedMealRequest.mealInfo.portions === 1
                                ? "meal"
                                : "meals"}
                            </Text>
                          </Td>
                        </Tr>
                      </Table>
                    </Card>
                  </div>
                )}
              </Stack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;

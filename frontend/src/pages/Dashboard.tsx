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
import dayGridPlugin from "@fullcalendar/daygrid";
// eslint-disable-next-line import/order
import FullCalendar from "@fullcalendar/react";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import MealRequestForm from "./MealRequestForm";

import Logout from "../components/auth/Logout";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { LOGIN_PAGE } from "../constants/Routes";
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
      description
      status
      dropOffDatetime
      dropOffLocation
      mealInfo {
        portions
        dietaryRestrictions
        mealSuggestions
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

const Dashboard = (): React.ReactElement => {
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
        requestorId: authenticatedUser!.registeredUser.id,
      },
    },
  );

  console.log(authenticatedUser);

  if (!authenticatedUser) {
    console.log("return");
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  const realEvents =
    mealRequests?.getMealRequestsByRequestorId.map(
      (mealRequest: MealRequest) => ({
        title: mealRequest.description,
        date: mealRequest.dropOffDatetime.toLocaleString().split('T')[0],
        extendedProps: { mealRequest },
        backgroundColor: "#3BA948",
        borderColor: "#3BA948",
        borderRadius: "10%"
      }),
    ) ?? [];

  console.log(realEvents);

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
        <ChakraButton
          colorScheme="green"
          fontSize={["12px", "16px", "16px", "16px"]}
          width={["100%", "100%", "100%", "auto"]}
          mt="10px"
          mb="20px"
        >
          + Create Request
        </ChakraButton>
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
                    // eventContent={renderEventContent}
                    eventClick={(info) => {
                      setSelectedMealRequest(
                        info.event.extendedProps.mealRequest,
                      );
                      // info.el.style.borderColor = "red";
                    }}
                    eventMouseLeave={() => {
                      setSelectedMealRequest(undefined);
                    }}
                  />
                </div>
                {selectedMealRequest && (
                  <div style={{ width: "30%", margin: "20px" }}>
                    <Text>
                      <strong>Upcoming Delivery</strong>
                    </Text>
                    <Card padding={3}>
                      <CardBody>
                        <Table variant="unstyled" size="lg">
                          <Tr>
                            <Td>
                              <AtSignIcon />
                            </Td>
                            <Text>
                              <strong>
                                Location: <br />
                              </strong>
                              {selectedMealRequest.dropOffLocation}
                            </Text>
                          </Tr>
                          <Tr>
                            <Td>
                              <InfoIcon />
                            </Td>
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
                          </Tr>

                          <Tr>
                            <Td>
                              <EmailIcon />
                            </Td>
                            <Text>
                              <strong>Delivery notes: </strong>
                              <br />
                              {selectedMealRequest.deliveryInstructions}
                            </Text>
                          </Tr>
                        </Table>
                      </CardBody>
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

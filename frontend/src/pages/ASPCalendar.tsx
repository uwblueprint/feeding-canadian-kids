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
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

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

const ASPCalandar = (): React.ReactElement => {
  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const calandarRef = React.createRef<FullCalendar>();

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
            if (selectedMealRequest === info.event.extendedProps.mealRequest) {
              setSelectedMealRequest(undefined);
            } else {
              setSelectedMealRequest(info.event.extendedProps.mealRequest);
            }
          }}
          ref={calandarRef}
        />
      </div>
      <div
        style={{
          width: "30%",
          margin: "20px",
          marginTop: "0px",
          marginRight: "0px",
        }}
      >
        {selectedMealRequest && (
          <>
            <Text fontSize="md" padding={5} paddingTop={1}>
              Upcoming Delivery
            </Text>
            <Card padding={3} width={80} variant="outline">
              <HStack padding={3} style={{ justifyContent: "space-between" }}>
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
                    {/* TODO: Change this to donor onsite staff */}
                    {selectedMealRequest.onsiteStaff.map((staffMember) => (
                      <>
                        <Text>{staffMember.name}</Text>
                        <Text>{staffMember.email}</Text>
                        <Text>{staffMember.phone}</Text>
                      </>
                    ))}
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
          </>
        )}
      </div>
    </Stack>
  );
};

export default ASPCalandar;

import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
import React, { useContext, useEffect, useRef, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/common/LoadingSpinner";
import { MealRequestCalendarView } from "../components/common/MealRequestCalendarView";
import { CREATE_MEAL_REQUEST_PAGE, LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { MealRequest } from "../types/MealRequestTypes";

const ASPCalandar = (): React.ReactElement => {
  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    return date.toDateString();
  }

  function formatTime(inputDate: string): string {
    return new Date(inputDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  return (
    <Stack direction="row">
      <div style={{ width: "100%" }}>
        <MealRequestCalendarView
          aspId={authenticatedUser.id}
          showNextButton={false}
          onSelectNewMealRequest={(mealRequest: MealRequest) => {
            setSelectedMealRequest(mealRequest);
          }}
          allowMultipleSelection={false}
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
                  {formatDate(selectedMealRequest.dropOffDatetime + "Z")}
                </Text>
                <Text>
                  {formatTime(selectedMealRequest.dropOffDatetime + "Z")}
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
                      {selectedMealRequest.requestor.info?.organizationAddress}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td width={2}>
                    <IoPersonOutline />
                  </Td>
                  <Td>
                    <Text>
                      <strong>Your Onsite Staff:</strong>{" "}
                    </Text>
                    {selectedMealRequest.onsiteContacts.map((staffMember) => (
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

                {selectedMealRequest.donationInfo ? (
                  <Tr>
                    <Td width={2}>
                      <IoInformationCircleOutline />
                    </Td>
                    <Td>
                      <Text>
                        <strong>Donor provided Information</strong>
                      </Text>
                      <br />
                      Donor Name:{" "}
                      {
                        selectedMealRequest.donationInfo.donor.info
                          ?.organizationName
                      }
                      <br />
                      Meal Description:{" "}
                      {selectedMealRequest.donationInfo.mealDescription}
                      <br />
                      Additional Info:{" "}
                      {selectedMealRequest.donationInfo.additionalInfo}
                      <br />
                      Donor Onsite Contacts:
                      {selectedMealRequest?.donationInfo?.donorOnsiteContacts?.map(
                        (staffMember) => (
                          <>
                            <Text>{staffMember.name}</Text>
                            <Text>{staffMember.email}</Text>
                            <Text>{staffMember.phone}</Text>
                          </>
                        ),
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                      ) ?? <></>}
                    </Td>
                  </Tr>
                ) : null}
              </Table>
            </Card>
          </>
        )}
      </div>
    </Stack>
  );
};

export default ASPCalandar;

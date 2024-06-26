import { gql, useLazyQuery } from "@apollo/client";
import {
  Box,
  Button as ChakraButton,
  Flex,
  Image,
  Text,
  Wrap,
} from "@chakra-ui/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  IoArrowBackCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { PiForkKnifeFill } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isCallSignatureDeclaration } from "typescript";

import LoadingSpinner from "./LoadingSpinner";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsVariables,
  MealStatus,
} from "../../types/MealRequestTypes";
import {
  ASPDistance,
  GetUserData,
  GetUserVariables,
} from "../../types/UserTypes";
import { ErrorMessage } from "../../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import BackgroundImage from "../assets/background.png";

type ButtonProps = { text: string; path: string };
type SchoolSidebarProps = { aspId: string; distance: string };

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
            organizationName
          }
        }
        commitmentDate
        mealDescription
        additionalInfo
        donorOnsiteContacts {
          name
          email
          phone
        }
      }
    }
  }
`;

type CalendarViewProps = {
  aspId: string;
  showTitle?: boolean;
  status?: MealStatus[];
  showNextButton?: boolean;
  handleNext?: (mealRequests: string[]) => void;
  onSelectNewMealRequest?: (mealRequestId: MealRequest) => void;
  allowMultipleSelection?: boolean;
};
export const MealRequestCalendarView = ({
  aspId,
  showTitle = false,
  status = [
    MealStatus.OPEN,
    MealStatus.UPCOMING,
    MealStatus.CANCELLED,
    MealStatus.FULFILLED,
  ],
  showNextButton = true,
  handleNext = (selectedMealRequests: string[]) => {},
  onSelectNewMealRequest = (mealRequest: MealRequest) => {},
  allowMultipleSelection = true,
}: CalendarViewProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [
    getMealRequests,
    {
      data: mealRequests,
      error: getMealRequestsError,
      loading: getMealRequestsLoading,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      onError: (error) => {
        logPossibleGraphQLError(error, setAuthenticatedUser);
      },
    },
  );

  const [selectedMealRequests, setSelectedMealRequests] = useState<string[]>(
    [],
  );
  const [date, setDate] = useState(new Date());

  function formatDate(inputDate: Date): string {
    return inputDate.toISOString().split("T")[0];
  }

  const calRef = useRef<FullCalendar>(null);

  useEffect(() => {
    function reloadMealRequests() {
      const monthBefore = new Date(date);
      monthBefore.setMonth(monthBefore.getMonth() - 1);
      const monthAfter = new Date(date);
      monthAfter.setMonth(monthAfter.getMonth() + 1);
      getMealRequests({
        variables: {
          requestorId: aspId,
          minDropOffDate: formatDate(monthBefore),
          maxDropOffDate: formatDate(monthAfter),
          status,
        },
      });
      logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);
    }
    reloadMealRequests();

    calRef.current?.getApi().gotoDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspId, date, getMealRequests]);

  const renderEventContent = (eventInfo: {
    event: {
      title: string;
    };
    timeText: string;
  }) => (
    <>
      <Flex alignItems="center" gap="2px" fontSize="11px">
        <b>{eventInfo.event.title}</b>
        <PiForkKnifeFill />
      </Flex>
      <Box>{eventInfo.timeText.replace(/([ap])/g, "$1m")}</Box>
    </>
  );

  const realEvents =
    mealRequests?.getMealRequestsByRequestorId.map(
      (mealRequest: MealRequest) => {
        const startDate = new Date(mealRequest.dropOffDatetime + "Z");
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        return {
          title: `${mealRequest.mealInfo.portions}`,
          start: startDate,
          end: endDate,
          extendedProps: {
            id: `${mealRequest.id}`,
            icon: "test",
            mealRequest,
          },
          backgroundColor: allowMultipleSelection
            ? `${
                selectedMealRequests.includes(mealRequest.id)
                  ? "#c4c4c4"
                  : "#FFFFFF"
              }`
            : "#FFFFFF",
          display: "block",
        };
      },
    ) ?? [];

  if (getMealRequestsLoading) {
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
    <Box>
      {showTitle ? (
        <>
          <Text fontSize="24px" fontWeight="600" color="#272D77">
            Select Dates to Donate Meals
          </Text>
          <Text
            display="flex"
            gap="5px"
            alignItems="center"
            margin="5px 0px 0px 0px"
          >
            *each date displays the meal delivery time slot & number of meals
            needed
            <PiForkKnifeFill />
          </Text>
          <Text margin="20px 0px">
            Dates selected: {selectedMealRequests.length}
          </Text>
        </>
      ) : null}

      <Box fontSize="10px">
        <FullCalendar
          headerToolbar={{
            left: "customPrevButton",
            center: "title",
            right: "customNextButton",
          }}
          ref={calRef}
          customButtons={{
            customPrevButton: {
              icon: "fc-icon-chevron-left",
              click() {
                const prevMonth = new Date(date);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setDate(prevMonth);
              },
            },
            customNextButton: {
              icon: "fc-icon-chevron-right",
              click() {
                const nextMonth = new Date(date);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setDate(nextMonth);
              },
            },
          }}
          initialDate={date}
          dayHeaderClassNames="custom-classname"
          themeSystem="Simplex"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={realEvents}
          selectable
          displayEventEnd
          eventTextColor="#000000"
          eventBorderColor="#FFFFFF"
          eventInteractive
          eventLongPressDelay={0}
          eventClick={(info) => {
            onSelectNewMealRequest(info.event.extendedProps.mealRequest);

            if (!allowMultipleSelection) {
              setSelectedMealRequests([info.event.extendedProps.id]);
              return;
            }

            if (selectedMealRequests.includes(info.event.extendedProps.id)) {
              setSelectedMealRequests(
                selectedMealRequests.filter(
                  (id) => id !== info.event.extendedProps.id,
                ),
              );
            } else {
              setSelectedMealRequests((prevSelected) => [
                ...prevSelected,
                info.event.extendedProps.id,
              ]);
            }
          }}
          eventContent={renderEventContent}
        />
      </Box>

      {showNextButton ? (
        <ChakraButton
          float="right"
          margin="20px 0px"
          onClick={() => handleNext(selectedMealRequests)}
          disabled={selectedMealRequests.length === 0}
        >
          Next
        </ChakraButton>
      ) : null}
    </Box>
  );
};

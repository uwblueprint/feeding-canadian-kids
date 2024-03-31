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
import React, { useEffect, useRef, useState } from "react";
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
type CalendarViewProps = {
  aspId: string;
  showTitle?: boolean;
  status?: MealStatus[];
};

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

export const MealRequestCalendarView = ({
  aspId,
  showTitle = false,
  status = [
    MealStatus.OPEN,
    MealStatus.UPCOMING,
    MealStatus.CANCELLED,
    MealStatus.FULFILLED,
  ],
}: CalendarViewProps) => {
  const [
    getMealRequests,
    {
      data: mealRequests,
      error: getMealRequestsError,
      loading: getMealRequestsLoading,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_ID,
  );

  const [selectedMealRequests, setSelectedMealRequests] = useState<string[]>(
    [],
  );
  const [date, setDate] = useState(new Date());

  function formatDate(inputDate: Date): string {
    return inputDate.toISOString().split("T")[0];
  }

  const calRef = useRef<FullCalendar>(null);
  const navigate = useNavigate();


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
      logPossibleGraphQLError(getMealRequestsError);
    }
    reloadMealRequests();

    calRef.current?.getApi().gotoDate(date);
  }, [aspId, date, getMealRequests, getMealRequestsError]);

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
        const startDate = new Date(mealRequest.dropOffDatetime);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        return {
          title: `${mealRequest.mealInfo.portions}`,
          start: startDate,
          end: endDate,
          extendedProps: {
            id: `${mealRequest.id}`,
            icon: "test",
          },
          backgroundColor: `${
            selectedMealRequests.includes(mealRequest.id)
              ? "#c4c4c4"
              : "#FFFFFF"
          }`,
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
          eventClick={(info) => {
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

      <ChakraButton
        float="right"
        margin="20px 0px"
        onClick={() => handleNext()}
        disabled={selectedMealRequests.length === 0}
      >
        Next
      </ChakraButton>
    </Box>
  );
};

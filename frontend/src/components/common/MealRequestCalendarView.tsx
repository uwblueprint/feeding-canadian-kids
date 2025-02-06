import { WatchQueryFetchPolicy, gql, useLazyQuery } from "@apollo/client";
import {
  Box,
  Button as ChakraButton,
  Flex,
  Image,
  Stack,
  Text,
  Wrap,
  background,
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
  MealRequestsRequestorVariables,
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
  shouldRefetch?: boolean;
  afterRefetch?: () => void;
  pageContext?: string;
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
  shouldRefetch = false,
  afterRefetch = () => {},
  pageContext = "",
}: CalendarViewProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [
    getMealRequests,
    {
      data: mealRequests,
      error: getMealRequestsError,
      loading: getMealRequestsLoading,
    },
  ] = useLazyQuery<MealRequestsData, MealRequestsRequestorVariables>(
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

  function reloadMealRequests(
    fetchPolicy: WatchQueryFetchPolicy = "cache-first",
  ) {
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
      fetchPolicy,
    });
    logPossibleGraphQLError(getMealRequestsError, setAuthenticatedUser);
  }
  const calRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (shouldRefetch) {
      reloadMealRequests("network-only");
      afterRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefetch]);

  useEffect(() => {
    reloadMealRequests();

    calRef.current?.getApi().gotoDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspId, date, getMealRequests]);

  const renderEventContent = (eventInfo: {
    event: {
      title: string;
    };
    timeText: string;
  }) => {
    const aspEventText = eventInfo.timeText.replace(/([ap])/g, "$1m");
    // For meal donors, we are low on space, so remove the spaces and remove the first "am" or "pm"
    // to save space
    const mealDonorEventText = eventInfo.timeText
      .replace(/([ap])/g, "$1m")
      .replace(" ", "")
      .replace("am", "")
      .replace("pm", "");

    return (
      <Flex
        paddingX={pageContext === "asp" ? "10px" : "0px"}
        direction="column"
        paddingY="3px"
        alignItems="center"
        fontSize="10px"
      >
        {pageContext === "asp" ? (
          <b>{aspEventText}</b>
        ) : (
          <Stack width="100%" padding="0">
            <Flex alignItems="center" gap="2px" fontSize="11px">
              <b>{eventInfo.event.title}</b>
              <PiForkKnifeFill />
            </Flex>
            <Box>{mealDonorEventText}</Box>
          </Stack>
        )}
      </Flex>
    );
  };

  const getEventColor = (mealRequest: MealRequest) => {
    if (pageContext === "asp") {
      if (mealRequest.donationInfo) {
        if (mealRequest.status === MealStatus.FULFILLED) {
          // return "#2e8438";
          return "#C6F6D5";
        }
        if (mealRequest.status === MealStatus.UPCOMING) {
          return "#D5C4EC"
        }

        return mealRequest.id === selectedMealRequests[0]
          ? "#C6F6D5"
          : "#3BA948";
      }

      return mealRequest.id === selectedMealRequests[0] ? "#BFBFBF" : "#DFDFDF";
    }

    if (selectedMealRequests.includes(mealRequest.id)) {
      return "#c4c4c4";
    }

    return "#FFFFFF";
  };

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
          backgroundColor: getEventColor(mealRequest),
          textColor: "black",
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
      {pageContext === "asp" ? (
        <style>
          {`
          .fc-event {
            border-radius: 50px;
            overflow: hidden;
          }
        `}
        </style>
      ) : null}
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
                prevMonth.setDate(1);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setDate(prevMonth);
              },
            },
            customNextButton: {
              icon: "fc-icon-chevron-right",
              click() {
                const nextMonth = new Date(date);
                nextMonth.setDate(1);
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
          eventTextColor="#FFFFFF"
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

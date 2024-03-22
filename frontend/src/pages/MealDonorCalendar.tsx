import { gql, useLazyQuery, useQuery } from "@apollo/client";
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

import EditMealRequestForm from "./EditMealRequestForm";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import LoadingSpinner from "../components/common/LoadingSpinner";
import * as Routes from "../constants/Routes";
import {
  MealRequest,
  MealRequestsData,
  MealRequestsVariables,
  MealStatus,
} from "../types/MealRequestTypes";
import { ASPDistance, GetUserData, GetUserVariables } from "../types/UserTypes";
import { ErrorMessage } from "../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";

type ButtonProps = { text: string; path: string };
type SchoolSidebarProps = { aspId: string; distance: string };
type CalendarViewProps = { aspId: string };

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

const GET_USER = gql`
  query GetUserByID($id: String!) {
    getUserById(id: $id) {
      id
      info {
        email
        organizationAddress
        organizationName
        organizationDesc
        roleInfo {
          aspInfo {
            numKids
          }
        }
        primaryContact {
          name
          phone
          email
        }
        initialOnsiteContacts {
          name
          phone
          email
        }
      }
    }
  }
`;

const SchoolSidebar = ({ aspId, distance }: SchoolSidebarProps) => {
  const {
    data: userInfo,
    error: getUserError,
    loading: getUserLoading,
  } = useQuery<GetUserData, GetUserVariables>(GET_USER, {
    variables: {
      id: aspId,
    },
  });

  logPossibleGraphQLError(getUserError);

  const schoolInfo = userInfo?.getUserById?.info;
  const navigate = useNavigate();

  return (
    <Flex
      flexDirection="column"
      textAlign="left"
      borderRight="2px solid #D9D9D9"
      padding="20px 40px"
    >
      <IoArrowBackCircleOutline
        size="38px"
        color="#CFCECE"
        cursor="pointer"
        onClick={() => navigate(Routes.MEAL_DONOR_DASHBOARD_PAGE)}
      />
      <Flex marginBottom="30px">
        <Image
          src="https://images.squarespace-cdn.com/content/v1/5dc5d641498834108f7c46a5/6384d8a2-9c31-4ae6-a287-256643f2271e/responsiveclassroom.png?format=1500w"
          alt={schoolInfo?.organizationName}
          borderRadius="full"
          objectFit="contain"
          height="200px"
        />
      </Flex>

      <Flex gap="15px" flexDirection="column">
        <Text>{`${distance} km away`}</Text>
        <Text
          fontSize="40px"
          fontFamily="Dimbo"
          fontWeight="400"
          color="#272D77"
        >
          {schoolInfo?.organizationName}
        </Text>
        <Flex alignItems="center" gap="5px">
          <IoPersonOutline />
          <Text>{schoolInfo?.roleInfo.aspInfo?.numKids}</Text>
        </Flex>
        <Flex alignItems="center" gap="5px">
          <IoLocationOutline />
          <Text>{schoolInfo?.organizationAddress}</Text>
        </Flex>
        <Text>{schoolInfo?.organizationDesc}</Text>
      </Flex>

      {/* <Flex
        flexDirection="column"
        gap="10px"
      >
        <Text>
          Meal Accomodations Needed
        </Text>
        <Flex gap="10px">
          <Box borderRadius="md" bg="#EBEEFF" padding="10px">
            Accomodation 1
          </Box>
          <Box borderRadius="md" bg="#EBF6ED" padding="10px">
            Accomodation 2
          </Box>
        </Flex> 
      </Flex> */}
    </Flex>
  );
};

const CalendarView = ({ aspId }: CalendarViewProps) => {
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
      },
    });
    // console.log(getMealRequestsError)
    logPossibleGraphQLError(getMealRequestsError);
  }

  function handleNext() {
    // Do something with selectedMealRequests
    console.log(selectedMealRequests);
  }

  useEffect(() => {
    const prevButton = document.querySelectorAll(".fc-prev-button");
    console.log(prevButton);
    if (prevButton[0] !== undefined) {
      console.log("got prev button", prevButton[0]);
      console.log("setting prev button");
      prevButton[0].addEventListener("click", () => {
        alert("test");
        const prevMonth = new Date(date);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setDate(prevMonth);
      });
    }
    reloadMealRequests();
  }, [date]);

  const renderEventContent = (eventInfo: any) => (
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
      <Text fontSize="24px" fontWeight="600" color="#272D77">
        Select Dates to Donate Meals
      </Text>
      <Text
        display="flex"
        gap="5px"
        alignItems="center"
        margin="5px 0px 0px 0px"
      >
        *each date displays the meal delivery time slot & number of meals needed
        <PiForkKnifeFill />
      </Text>
      <Text margin="20px 0px">
        Dates selected: {selectedMealRequests.length}
      </Text>

      <Box fontSize="10px">
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
          // datesSet={(dateInfo) => {
          //   const newDate = new Date(dateInfo.startStr);
          //   setDate(newDate);
          // }}
        />
      </Box>

      <ChakraButton
        float="right"
        margin="20px 0px"
        onClick={() => handleNext()}
      >
        Next
      </ChakraButton>
    </Box>
  );
};

const MealDonorCalendar = (): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const aspId = searchParams.get("aspId");
  const distance = searchParams.get("distance");
  if (!aspId || !distance) {
    return (
      <ErrorMessage>
        Invalid URL, please go back to home and try again!
      </ErrorMessage>
    );
  }

  return (
    <Flex borderTop="2px solid #D9D9D9">
      <Flex width="400px" justifyContent="center">
        <SchoolSidebar aspId={aspId} distance={distance} />
      </Flex>
      <Flex width="100%" justifyContent="center" margin="30px 10px">
        <CalendarView aspId={aspId} />
      </Flex>
    </Flex>
  );
};

export default MealDonorCalendar;

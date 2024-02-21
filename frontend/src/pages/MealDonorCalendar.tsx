import { gql, useMutation, useQuery } from "@apollo/client";
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
import React, { useState } from "react";
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

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

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

  return (
    <Flex
      flexDirection="column"
      textAlign="left"
      borderRight="2px solid #D9D9D9"
      padding="20px 40px"
    >
      <IoArrowBackCircleOutline size="38px" color="#CFCECE"/>
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
        <Text fontSize="40px" fontFamily="Dimbo" fontWeight="400" color="#272D77">
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
  const {
    data: mealRequests,
    error: getMealRequestsError,
    loading: getMealRequestsLoading,
  } = useQuery<MealRequestsData, MealRequestsVariables>(
    GET_MEAL_REQUESTS_BY_ID,
    {
      variables: {
        requestorId: aspId,
      },
    },
  );

  const [selectedMealRequests, setSelectedMealRequests] = useState<string[]>([]);

  logPossibleGraphQLError(getMealRequestsError);

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

        // console.log(mealRequest.dropOffDatetime)

        return {
          title: `${mealRequest.mealInfo.portions}`,
        //   start: `${new Date(
        //     mealRequest.dropOffDatetime.toLocaleString(),
        //   ).toLocaleTimeString("en-US", {
        //     hour: "numeric",
        //     minute: "numeric",
        //     hour12: true,
        //   })}`,
            start: mealRequest.dropOffDatetime,
          // date: realDate,
          extendedProps: { 
            id: `${mealRequest.id}`,
            icon: 'test'
            },
          backgroundColor: `${selectedMealRequests.includes(mealRequest.id) ? "#444444" : "#E2E8F0"}`,
          color: "#000000",
          // eventAfterRender
           display: "block"
        //   borderColor: "#3BA948",
        //   borderRadius: "10%",
        };
      },
    ) ?? [];

    console.log(realEvents)

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
      <Text margin="20px 0px">Number selected: {selectedMealRequests.length}</Text>

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
        // eventContent={renderEventContent}
        eventClick={(info) => {
            if (selectedMealRequests.includes(info.event.extendedProps.id)) {
                setSelectedMealRequests(selectedMealRequests.filter(id => id !== info.event.extendedProps.id));
            } else {
                setSelectedMealRequests(prevSelected => [...prevSelected, info.event.extendedProps.id]);
            }
        }}
        // eventContent={(arg, element) => {
        //     if (arg.event.extendedProps) {
        //         // element.find(".fc-title").prepend(<PiForkKnifeFill />);
        //     }
        // }}
        // eventMouseLeave={() => {
        //   setSelectedMealRequest(undefined);
        // }}
      />

      <ChakraButton float="right" margin="20px 0px">
        Next
      </ChakraButton>
    </Box>
  );
};

const MealDonorCalendar = (): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  // const aspId = searchParams.get("aspId");
  // const distance = searchParams.get("distance");
  const aspId = "65b6fc756aacd51b15a859ce";
  const distance = "4";

  return (
    <Flex
      // style={{
      //   textAlign: "center",
      //   paddingTop: "20px",
      //   height: "100vh",
      //   backgroundImage: `url(${BackgroundImage})`,
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      // }}
      borderTop="2px solid #D9D9D9"
    >
      <Flex width="400px" justifyContent="center">
        <SchoolSidebar aspId={aspId} distance={distance}/>
      </Flex>
      <Flex width="100%" justifyContent="center" margin="30px 10px">
        <CalendarView aspId={aspId}/>
      </Flex>
    </Flex>
  );
}

export default MealDonorCalendar;

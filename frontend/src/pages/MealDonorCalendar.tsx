import { gql, useQuery } from "@apollo/client";
import { Flex, Image, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  IoArrowBackCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MealRequestCalendarView } from "../components/common/MealRequestCalendarView";
import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { MealStatus } from "../types/MealRequestTypes";
import { GetUserData, GetUserVariables } from "../types/UserTypes";
import { ErrorMessage } from "../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import { useGetDefaultPageForUser } from "../utils/useGetDefaultPageForUser";

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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  logPossibleGraphQLError(getUserError, setAuthenticatedUser);

  const schoolInfo = userInfo?.getUserById?.info;
  const navigate = useNavigate();
  const defaultPage = useGetDefaultPageForUser();

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
        onClick={() => navigate(defaultPage)}
      />
      <Flex marginBottom="30px">
        <Image
          src="/classroom_compressed.jpg"
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

const MealDonorCalendar = (): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const aspId = searchParams.get("aspId");
  const distance = searchParams.get("distance");
  if (!aspId || !distance) {
    return (
      <ErrorMessage>
        Invalid URL, please go back to home and try again!
      </ErrorMessage>
    );
  }

  const handleNext = (selectedMealRequests: Array<string>) => {
    // Do something with selectedMealRequests
    navigate(
      `${Routes.MEAL_DONOR_FORM_PAGE}?ids=${selectedMealRequests.join(
        ",",
      )}&aspId=${aspId}`,
    );
  };
  return (
    <Flex borderTop="2px solid #D9D9D9">
      <Flex width="400px" justifyContent="center">
        <SchoolSidebar aspId={aspId} distance={distance} />
      </Flex>
      <Flex width="100%" justifyContent="center" margin="30px 10px">
        <MealRequestCalendarView
          aspId={aspId}
          showTitle
          status={[MealStatus.OPEN]}
          showNextButton
          handleNext={handleNext}
        />
      </Flex>
    </Flex>
  );
};

export default MealDonorCalendar;

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Image,
  Stack,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import ConfirmationImage from "../assets/confirmation.png";
import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { GetUserData, GetUserVariables, UserInfo } from "../types/UserTypes";

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

const MealDonorConfirmation = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const aspId = searchParams.get("aspId");

  const {
    data: userInfo,
    error: getUserError,
    loading: getUserLoading,
  } = useQuery<GetUserData, GetUserVariables>(GET_USER, {
    variables: {
      id: aspId || "",
    },
  });

  const [isMobile] = useMediaQuery("(min-width: 768px)");

  const schoolInfo = userInfo?.getUserById?.info;

  const [donorInfo, setDonorInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const [organizationName, setOrganizationName] = useState(
    donorInfo?.organizationName || "",
  );

  return (
    <Box height="100vh" p={8} marginY={isMobile ? "0px" : "100px"}>
      {isMobile ? (
        <Stack direction="row" spacing={0} height="100%">
          <Box flex="1" p={8}>
            <Center height="100%">
              <Image
                src={ConfirmationImage}
                alt="Confirmation"
                borderRadius="lg"
              />
            </Center>
          </Box>
          <Box flex="1" p={8}>
            <Center height="100%">
              <Stack spacing={6} padding={6}>
                <Text
                  fontFamily="Dimbo"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize={["26px", "40px"]}
                  color="primary.blue"
                >
                  {schoolInfo?.organizationName} ❤️ {organizationName}!
                </Text>
                <Text>
                  Thank you {organizationName} for contributing to{" "}
                  {schoolInfo?.organizationName}&apos;s mission to provide hot
                  meals to kids! We&apos;ve got many hungry kiddos here, and
                  your generosity has seriously made a huge difference in their
                  lives. You didn&apos;t just fill their tummies; you put smiles
                  on their faces. Thanks a million for being awesome and helping
                  us out – we truly appreciate it!
                </Text>
                <Center>
                  <Button
                    colorScheme="green"
                    as={RouterLink}
                    to={Routes.MEAL_DONOR_UPCOMING_PAGE}
                  >
                    View my donations
                  </Button>
                </Center>
              </Stack>
            </Center>
          </Box>
        </Stack>
      ) : (
        <VStack spacing={8} height="100%">
          <Box p={8}>
            <Center>
              <Image
                src={ConfirmationImage}
                alt="Confirmation"
                borderRadius="lg"
              />
            </Center>
          </Box>
          <Box p={8}>
            <Stack spacing={6} padding={6}>
              <Text
                fontFamily="Dimbo"
                fontStyle="normal"
                fontWeight="400"
                fontSize={["26px", "40px"]}
                color="primary.blue"
              >
                Care Kids ❤️ Swiss Chalet Ottawa!
              </Text>
              <Text>
                Thank you Swiss Chalet Ottawa for contributing to Care
                Kid&apos;s mission to provide hot meals to kids! We&apos;ve got
                many hungry kiddos here, and your generosity has seriously made
                a huge difference in their lives. You didn&apos;t just fill
                their tummies; you put smiles on their faces. Thanks a million
                for being awesome and helping us out – we truly appreciate it!
              </Text>
              <Center>
                <Button
                  colorScheme="green"
                  as={RouterLink}
                  to={Routes.MEAL_DONOR_UPCOMING_PAGE}
                >
                  View my donations
                </Button>
              </Center>
            </Stack>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default MealDonorConfirmation;

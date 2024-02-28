import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useLocation} from "react-router-dom";

import { AuthenticatedUser, Contact } from "../../../../types/UserTypes";
import OnsiteStaffSection from "../../../common/OnsiteStaffSection";

type MealDonationFormContactInfoProps = {
  onsiteStaff: Contact[];
  setOnsiteStaff: React.Dispatch<React.SetStateAction<Contact[]>>;
  availableStaff: Contact[];
  authenticatedUser: AuthenticatedUser;
  handleNext: () => void;
};

interface MealRequest {
  dropOffDatetime: Date;
  id: string;
  mealInfo: {
    dietaryRestrictions: string;
    portions: number;
  };
}

const MealDonationFormContactInfo: React.FunctionComponent<MealDonationFormContactInfoProps> = ({
  onsiteStaff,
  setOnsiteStaff,
  availableStaff,
  authenticatedUser,
  handleNext,
}) => {
  const requestorId = authenticatedUser?.id;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idsParam = searchParams.get("ids");

  // Split the idsParam by dot to get an array of ids
  const ids = idsParam ? idsParam.split(",") : [];

  const GET_MEAL_REQUESTS = gql`
  query getMealRequestsByIds{
    getMealRequestsByIds(
      requestorId: "${requestorId}"
      ids: [${ids?.map((id) => `"${id}"`).join(", ")}],
    ) {
      id
      requestor {
        id
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
          id
        }
        commitmentDate
        mealDescription
        additionalInfo
      }
    }
  }
  `;

  const { data: userData, error: getUserError } = useQuery(GET_MEAL_REQUESTS);

  return (
    <Grid
      marginTop={{ base: "1rem", md: "2rem" }}
      paddingLeft={{ base: "1rem", md: "2rem" }}
      paddingRight={{ base: "1rem", md: "2rem" }}
      textAlign={{ base: "left", md: "left" }}
    >
      <Stack>
        <SimpleGrid
          templateColumns="1fr 0fr 1fr"
          gap={4}
          marginBottom={{ base: "4rem" }}
        >
          <GridItem>
            <Stack>
              <Text fontSize="2xl" as="b">
                Step 1
              </Text>
              <Text>Contact Information</Text>
              <Flex maxWidth="550px" flexDir="column">
                <OnsiteStaffSection
                  onsiteInfo={onsiteStaff}
                  setOnsiteInfo={setOnsiteStaff}
                  attemptedSubmit={false}
                  availableStaff={availableStaff}
                  dropdown
                />
              </Flex>
            </Stack>
          </GridItem>
          <Divider
            orientation="vertical"
            borderWidth="2px"
            borderColor="primary.blue"
            color="primary.blue"
            opacity={100}
          />
          <GridItem
            gap={4}
            paddingLeft={{ base: "1rem", md: "2rem" }}
            paddingRight={{ base: "1rem", md: "2rem" }}
          >
            <Stack>
              <Stack paddingY={{ base: "1rem", md: "1.5rem" }}>
                <Text>Meal Delivery Details</Text>
                <Text fontSize="2xl" fontWeight="semibold" lineHeight="20px">
                  {userData?.getMealRequestsByIds?.length} Dates
                </Text>
                <HStack>
                  <IoLocationOutline />
                  <Text>
                    {userData?.getMealRequestsByIds[0]?.dropOffLocation}
                  </Text>
                </HStack>
              </Stack>
              <Stack overflowY="auto" maxHeight="260px" gap="0.8rem">
                {userData?.getMealRequestsByIds?.map((request: MealRequest) => (
                  <Box
                    bg="#F4F4F4E5"
                    maxW="350px"
                    borderRadius="md"
                    paddingX="15px"
                    paddingY="15px"
                    key={request.id}
                  >
                    <HStack>
                      <Stack w="50%">
                        <Text fontSize="xs" lineHeight="15px">
                          {new Date(request.dropOffDatetime).toLocaleDateString(
                            undefined,
                            {
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </Text>
                        <Text
                          fontWeight="semibold"
                          fontSize="s"
                          lineHeight="15px"
                        >
                          {request.mealInfo.portions} Meals
                        </Text>
                        <Text lineHeight="20px" fontSize="xs">
                          {new Date(request.dropOffDatetime).toLocaleTimeString(
                            "en-US",
                            {
                              timeZone: "America/Toronto",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            },
                          )}
                        </Text>
                      </Stack>
                      <Stack w="50%" fontSize={{base: "2xs", md: "xs"}} lineHeight="15px">
                        <Text>Acommodations:</Text>
                        <Text>{request.mealInfo.dietaryRestrictions}</Text>
                      </Stack>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </GridItem>
        </SimpleGrid>
        <GridItem
          colSpan={{ base: 1, md: 3 }}
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            colorScheme="primary.green"
            variant="solid"
            size="xs"
            onSubmit={(e) => e.preventDefault()}
            height={{ base: "2rem", md: "3rem" }}
            width={{ base: "10%", md: "10%" }}
            bg="primary.green"
            onClick={handleNext}
          >
            Next
          </Button>
        </GridItem>
      </Stack>
    </Grid>
  );
};

export default MealDonationFormContactInfo;

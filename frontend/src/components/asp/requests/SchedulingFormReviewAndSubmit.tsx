import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Value } from "react-multi-date-picker";
import { useNavigate } from "react-router-dom";

import { ASP_DASHBOARD_PAGE } from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Contact, OnsiteContact } from "../../../types/UserTypes";
import { logPossibleGraphQLError } from "../../../utils/GraphQLUtils";
import { convertTimeToUtc } from "../../../utils/convertTimeToUTC";

// Create the GraphQL mutation
const CREATE_MEAL_REQUEST = gql`
  mutation CreateMealRequest(
    $numMeals: Int!
    $dietaryRestrictions: String
    $deliveryInstructions: String
    $onsiteContact: [String!]!
    $scheduledDropOffTime: Time!
    $mealRequestDates: [Date!]!
    $userId: ID!
  ) {
    createMealRequest(
      deliveryInstructions: $deliveryInstructions
      onsiteContacts: $onsiteContact
      mealInfo: {
        portions: $numMeals
        dietaryRestrictions: $dietaryRestrictions
      }
      dropOffTime: $scheduledDropOffTime
      requestDates: $mealRequestDates
      requestorId: $userId
    ) {
      mealRequests {
        id
      }
    }
  }
`;

type SchedulingFormReviewAndSubmitProps = {
  // From part 1
  scheduledDropOffTime: string;
  mealRequestDates: Date[];

  // From part 2
  numMeals: number;
  dietaryRestrictions: string;
  deliveryInstructions: string;
  onsiteContact: OnsiteContact[];
  address: string;

  // User ID
  userId: string;

  // Switch tabs
  handleBack: () => void;
};

const SchedulingFormReviewAndSubmit: React.FunctionComponent<SchedulingFormReviewAndSubmitProps> = ({
  address,
  scheduledDropOffTime,
  mealRequestDates,
  numMeals,
  dietaryRestrictions,
  deliveryInstructions,
  onsiteContact,
  userId,
  handleBack,
}) => {
  const [createMealRequest] = useMutation<{
    createMealRequest: { id: string };
  }>(CREATE_MEAL_REQUEST);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const toast = useToast();

  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    await setIsSubmitLoading(true);

    try {
      // NOTE: Have to pass in date /times to mongodb in UTC time!!
      const response = await createMealRequest({
        variables: {
          numMeals,
          dietaryRestrictions,
          deliveryInstructions,
          onsiteContact: onsiteContact.map((staff: OnsiteContact) => staff.id),
          // convert time to utc (keep it as time)
          scheduledDropOffTime: convertTimeToUtc(scheduledDropOffTime),
          userId,
          mealRequestDates: mealRequestDates.map((date) => {
            const hours = parseInt(scheduledDropOffTime.split(":")[0], 10);
            const mins = parseInt(scheduledDropOffTime.split(":")[1], 10);

            // This is very important! it makes sure that the date has the correct time before we convert timezones to UTC. If the date doesn't have the correct tiem before we convert, it can lead to some really tricky bugs!
            date.setHours(hours, mins);
            // ISO Date string means that the timezone is always UTC
            return date.toISOString().split("T", 1)[0];
          }),
        },
      });

      // On success, navigate to dashboard
      if (response.data) {
        toast({
          title: "Meal request submitted!",
          status: "success",
          isClosable: true,
        });
        navigate(`${ASP_DASHBOARD_PAGE}?refetch=true`);
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      let errorMessage;
      if (
        (e as Error).message.includes(
          "Meal request already exists for this ASP",
        )
      ) {
        // The last word is the date
        const date = (e as Error).message.split(" ").pop();
        if (!date) {
          errorMessage = "Failed to create meal request. Please try again.";
          toast({
            title: errorMessage,
            status: "error",
            isClosable: true,
          });
          return;
        }
        // Construct a date object from the string
        const dateObj = new Date(date + "Z");

        errorMessage = `You have already created a meal request on ${dateObj.toLocaleDateString()}. Please choose another date, or edit your existing meal request.`;
      } else {
        errorMessage = "Failed to create meal request. Please try again.";
      }

      toast({
        title: errorMessage,
        status: "error",
        isClosable: true,
      });
    }

    await setIsSubmitLoading(false);
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={4}
      paddingLeft={{ base: "1rem", md: "2rem" }}
      paddingRight={{ base: "1rem", md: "2rem" }}
      textAlign={{ base: "left", md: "left" }}
    >
      <GridItem colSpan={1}>
        <Text as="b">Location</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column">
          <FormControl>
            <FormLabel variant="form-label-bold">Address</FormLabel>
            <Text>{address}</Text>
          </FormControl>
        </Flex>
      </GridItem>

      <GridItem colSpan={1}>
        <Text as="b">Meal Information</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <FormControl>
              <FormLabel variant="form-label-bold">Number of meals</FormLabel>
              <Text>{numMeals}</Text>
            </FormControl>
          </Flex>

          <Flex flexDir="column">
            <FormControl>
              <FormLabel variant="form-label-bold">
                Dietary Restrictions
              </FormLabel>
              <Text>{dietaryRestrictions || "None"}</Text>
            </FormControl>
          </Flex>

          <Flex flexDir="column">
            <FormControl>
              <FormLabel variant="form-label-bold">
                Delivery Instructions
              </FormLabel>
              <Text>{deliveryInstructions || "None"}</Text>
            </FormControl>
          </Flex>
        </Flex>
      </GridItem>

      <GridItem colSpan={1}>
        <Text as="b">Contact Information</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
              <Table>
                <Thead>
                  <Tr
                    borderRadius="8px 8px 0 0"
                    h="40px"
                    background="primary.lightblue"
                  >
                    <Th borderRadius="8px 0 0 0" w="256px" textTransform="none">
                      <Text color="black" variant="desktop-xs">
                        Full Name
                      </Text>
                    </Th>
                    <Th w="200px" textTransform="none">
                      <Text color="black" variant="desktop-xs">
                        Phone Number
                      </Text>
                    </Th>
                    <Th textTransform="none">
                      <Text color="black" variant="desktop-xs">
                        Email
                      </Text>
                    </Th>
                    <Th w="48px" borderRadius="0 8px 0 0" />
                  </Tr>
                </Thead>

                <Tbody>
                  {onsiteContact.map((staff, index) =>
                    staff ? (
                      <Tr key={index}>
                        <Td /* padding="0 12px 0 24px" */ w="256px">
                          <Text>{staff.name}</Text>
                        </Td>
                        <Td /* padding="0 12px" */ w="200px">
                          <Text>{staff.phone}</Text>
                        </Td>
                        <Td /* padding="0 0 0 12px" */>
                          <Text>{staff.email}</Text>
                        </Td>
                      </Tr>
                    ) : null,
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </Flex>
      </GridItem>

      {/* Next button that is right aligned */}
      <GridItem
        colSpan={{ base: 1, md: 3 }}
        display="flex"
        justifyContent="flex-end"
      >
        <Spacer />
        <Button
          colorScheme="primary.green"
          variant="outline"
          size="xs"
          onSubmit={(e) => e.preventDefault()}
          height={{ base: "2rem", md: "3rem" }}
          width={{ base: "10%", md: "10%" }}
          onClick={handleBack}
          marginRight="1rem"
        >
          Back
        </Button>
        <Button
          colorScheme="primary.green"
          variant="solid"
          size="xs"
          onSubmit={(e) => e.preventDefault()}
          height={{ base: "2rem", md: "3rem" }}
          width={{ base: "10%", md: "10%" }}
          bg="primary.green"
          onClick={handleSubmit}
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? <Spinner /> : "Submit"}
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SchedulingFormReviewAndSubmit;

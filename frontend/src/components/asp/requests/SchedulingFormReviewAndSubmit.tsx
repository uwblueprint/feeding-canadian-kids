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
import React, { useState } from "react";
import { Value } from "react-multi-date-picker";
import { useNavigate } from "react-router-dom";

import { DASHBOARD_PAGE } from "../../../constants/Routes";
import { Contact } from "../../../types/UserTypes";
import OnsiteStaffSection from "../../common/OnsiteStaffSection";

// Create the GraphQL mutation
const CREATE_MEAL_REQUEST = gql`
  mutation CreateMealRequest(
    $address: String!
    $numMeals: Int!
    $dietaryRestrictions: String
    $deliveryInstructions: String
    $onsiteStaff: [ContactInput!]!
    $scheduledDropOffTime: Time!
    $mealRequestDates: [Date!]!
    $userId: ID!
  ) {
    createMealRequest(
      dropOffLocation: $address
      deliveryInstructions: $deliveryInstructions
      onsiteStaff: $onsiteStaff
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
  address: string;
  numMeals: number;
  dietaryRestrictions: string;
  deliveryInstructions: string;
  onsiteStaff: Contact[];

  // User ID
  userId: string;

  // Switch tabs
  handleBack: () => void;
};

const SchedulingFormReviewAndSubmit: React.FunctionComponent<
  SchedulingFormReviewAndSubmitProps
> = ({
  scheduledDropOffTime,
  mealRequestDates,
  address,
  numMeals,
  dietaryRestrictions,
  deliveryInstructions,
  onsiteStaff,
  userId,
  handleBack,
}) => {
  const [createMealRequest] = useMutation<{
    createMealRequest: { id: string };
  }>(CREATE_MEAL_REQUEST);

  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await createMealRequest({
        variables: {
          address,
          numMeals,
          dietaryRestrictions,
          deliveryInstructions,
          onsiteStaff,
          // Format the scheduled drop off time with the current time zone
          scheduledDropOffTime,
          userId,
          mealRequestDates: mealRequestDates.map(
            (date) => date.toISOString().split("T", 1)[0],
          ),
        },
      });

      // On success, navigate to dashboard
      if (response.data) {
        toast({
          title: "Meal request submitted!",
          status: "success",
          isClosable: true,
        });
        navigate(DASHBOARD_PAGE);
      }
    } catch (e: unknown) {
      toast({
        title: "Failed to create meal request. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
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
                  {onsiteStaff.map((staff, index) =>
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
        >
          Submit
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SchedulingFormReviewAndSubmit;

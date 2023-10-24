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
  Td,
  Text,
  Textarea,
  Th,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { Contact } from "../../../types/UserTypes";

type SchedulingFormMealInfoProps = {
  address: string;
  setAddress: (address: string) => void;
  numMeals: number;
  setNumMeals: (numMeals: number) => void;
  dietaryRestrictions: string;
  setDietaryRestrictions: (dietaryRestrictions: string) => void;
  deliveryInstructions: string;
  setDeliveryInstructions: (deliveryInstructions: string) => void;
  onsiteStaff: Contact[];
  setOnsiteStaff: (onsiteStaff: Contact[]) => void;
  onsiteInfo: Contact[];
  handleNext: () => void;
};

const SchedulingFormMealInfo: React.FunctionComponent<SchedulingFormMealInfoProps> = ({
  address,
  setAddress,
  numMeals,
  setNumMeals,
  dietaryRestrictions,
  setDietaryRestrictions,
  deliveryInstructions,
  setDeliveryInstructions,
  onsiteStaff,
  setOnsiteStaff,
  onsiteInfo,
  handleNext,
}) => {
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  const validateData = () => {
    if (true) {
      // TODO validation
      // Handle validation error, display error message or prevent form submission
      setNextButtonEnabled(true);
      return;
    }
    setNextButtonEnabled(false);

    handleNext();
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
        <Text>Drop-off location</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column">
          <FormControl isRequired>
            <FormLabel variant="form-label-bold">Address</FormLabel>
            <Input
              required
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              onChange={(e) => setAddress(e.target.value)}
              type="date"
              rounded="md"
              width={{ base: "100%", md: "100%" }}
              placeholder="Select a date"
            />
          </FormControl>
        </Flex>
      </GridItem>

      <GridItem colSpan={1}>
        <Text as="b">Meal Information</Text>
        <Text>
          Please provide the necessary information regarding the donation
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <FormControl isRequired>
              <FormLabel variant="form-label-bold">Number of meals</FormLabel>
              <Input
                required
                size="xs"
                height={{ base: "2rem", md: "3rem" }}
                variant="outline"
                colorScheme="primary.blue"
                onChange={(e) => setNumMeals(parseInt(e.target.value, 10))}
                type="number"
                rounded="md"
                width={{ base: "100%", md: "100%" }}
                placeholder="40"
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column">
            <FormControl isRequired>
              <FormLabel variant="form-label-bold">
                Dietary Restrictions
              </FormLabel>
              <Input
                required
                size="xs"
                height={{ base: "2rem", md: "3rem" }}
                variant="outline"
                colorScheme="primary.blue"
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                type="text"
                rounded="md"
                width={{ base: "100%", md: "100%" }}
                placeholder="15 peanut-free meals"
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column">
            <FormControl>
              <FormLabel variant="form-label-bold">
                Delivery Instructions
              </FormLabel>
              <Textarea
                size="xs"
                height={{ base: "2rem", md: "3rem" }}
                variant="outline"
                colorScheme="primary.blue"
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                rounded="md"
                width={{ base: "100%", md: "100%" }}
                placeholder="Please leave the meals at the front desk"
                resize="vertical"
              />
            </FormControl>
          </Flex>
        </Flex>
      </GridItem>

      <GridItem colSpan={1}>
        <Text as="b">Contact Information</Text>
        <Text>
          Please provide the contact information of the staff who will be
          helping facilitate the meals
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <Text color="primary.blue" fontSize="xs">
              Must add at least one staff member. Update and create new staff
              contacts in User Settings.
            </Text>
            <FormControl isRequired>
              <FormLabel variant="form-label-bold">Onsite staff</FormLabel>
              {/* Table to show the onsite staff name, phone, and email. Dropdown is used to choose a staff member from
                onsiteInfo, which is a list of contacts */}
              {/* At the bottom is a button to add a new staff member */}

              <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
                <Table variant="simple">
                  {/* Give the header a gray background */}
                  <thead style={{ backgroundColor: "#E2E8F0" }}>
                    <Tr
                      borderRadius="8px 8px 0 0"
                      h="40px"
                      background="primary.lightblue"
                    >
                      <Th>Name</Th>
                      <Th>Phone</Th>
                      <Th>Email</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {onsiteStaff.map((staff, index) => (
                      <tr key={index}>
                        <Td>{staff.name}</Td>
                        <Td>{staff.phone}</Td>
                        <Td>{staff.email}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </FormControl>
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
          variant="solid"
          size="xs"
          onSubmit={(e) => e.preventDefault()}
          height={{ base: "2rem", md: "3rem" }}
          width={{ base: "10%", md: "10%" }}
          bg="primary.blue"
          onClick={validateData}
        >
          Next
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SchedulingFormMealInfo;

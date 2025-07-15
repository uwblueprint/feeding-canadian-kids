import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { Contact } from "../../../types/UserTypes";
import OnsiteContactSection from "../../common/OnsiteContactSection";

type SchedulingFormMealInfoProps = {
  address: string;
  numMeals: number;
  setNumMeals: (numMeals: number) => void;
  dietaryRestrictions: string;
  setDietaryRestrictions: (dietaryRestrictions: string) => void;
  deliveryInstructions: string;
  setDeliveryInstructions: (deliveryInstructions: string) => void;
  onsiteContact: Contact[];
  setOnsiteContact: React.Dispatch<React.SetStateAction<Contact[]>>;
  availableStaff: Contact[];
  handleBack: () => void;
  handleNext: () => void;
};

const SchedulingFormMealInfo: React.FunctionComponent<SchedulingFormMealInfoProps> = ({
  address,
  numMeals,
  setNumMeals,
  dietaryRestrictions,
  setDietaryRestrictions,
  deliveryInstructions,
  setDeliveryInstructions,
  onsiteContact,
  setOnsiteContact,
  availableStaff,
  handleBack,
  handleNext,
}) => {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateData = () => {
    if (
      numMeals <= 0 ||
      onsiteContact.length === 0 ||
      onsiteContact.some(
        (contact) =>
          !contact ||
          contact.name === "" ||
          contact.email === "" ||
          contact.phone === "",
      )
    ) {
      setAttemptedSubmit(true);
      return;
    }

    setAttemptedSubmit(false);
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
          <FormControl>
            <FormLabel variant="form-label-bold">Address</FormLabel>
            <Text>{address}</Text>
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
            <FormControl
              isInvalid={attemptedSubmit && numMeals <= 0}
              isRequired
            >
              <FormLabel variant="form-label-bold">Number of meals</FormLabel>
              <Input
                required
                size="xs"
                height={{ base: "2rem", md: "3rem" }}
                variant="outline"
                colorScheme="primary.blue"
                onChange={(e) => {
                  setNumMeals(parseInt(e.target.value, 10) || 0);
                }}
                type="text"
                pattern="[0-9]*"
                rounded="md"
                width={{ base: "100%", md: "100%" }}
                placeholder="40"
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column">
            <FormControl>
              <FormLabel variant="form-label-bold">
                Dietary Restrictions
              </FormLabel>
              <Input
                required
                size="xs"
                value={dietaryRestrictions}
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
                value={deliveryInstructions}
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
            <OnsiteContactSection
              onsiteInfo={onsiteContact}
              setOnsiteInfo={setOnsiteContact}
              attemptedSubmit={attemptedSubmit}
              availableStaff={availableStaff}
              dropdown
              userRole="ASP"
            />
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
          onClick={validateData}
        >
          Next
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SchedulingFormMealInfo;

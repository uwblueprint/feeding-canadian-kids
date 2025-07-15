import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import MealDeliveryDetails from "./MealDeliveryDetails";

import { MealRequest } from "../../../types/MealRequestTypes";

type MealDonationFormMealDetailsProps = {
  mealDescription: string;
  setMealDescription: React.Dispatch<React.SetStateAction<string>>;
  additionalInfo: string;
  setAdditionalInfo: React.Dispatch<React.SetStateAction<string>>;
  handleBack: () => void;
  handleNext: () => void;
  mealRequestsInformation: Array<MealRequest>;
};

const MealDonationFormMealDetails: React.FunctionComponent<MealDonationFormMealDetailsProps> = ({
  mealDescription,
  setMealDescription,
  additionalInfo,
  setAdditionalInfo,
  handleBack,
  handleNext,
  mealRequestsInformation,
}) => {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateData = () => {
    if (mealDescription === "") {
      setAttemptedSubmit(true);
      return;
    }

    setAttemptedSubmit(false);
    handleNext();
  };

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
                Step 2
              </Text>

              <Flex maxWidth="550px" flexDir="column">
                <FormControl
                  isInvalid={attemptedSubmit && mealDescription === ""}
                  isRequired
                >
                  <FormLabel variant="form-label-bold">
                    Food Description
                  </FormLabel>
                  Please describe a typical meal you can provide (this can be
                  modified later).
                  <Input
                    required
                    size="xs"
                    height={{ base: "2rem", md: "3rem" }}
                    variant="outline"
                    colorScheme="primary.blue"
                    onChange={(e) => {
                      setMealDescription(e.target.value);
                    }}
                    type="text"
                    rounded="md"
                    width={{ base: "100%", md: "100%" }}
                    margin="0.5rem 0"
                    placeholder="ex. 40 meat pastas and 5 vegetarian pastas"
                  />
                </FormControl>
              </Flex>

              <Flex maxWidth="550px" flexDir="column">
                <FormControl marginTop="1rem">
                  <FormLabel variant="form-label-bold">
                    Additional Info
                  </FormLabel>
                  <Input
                    size="xs"
                    height={{ base: "2rem", md: "3rem" }}
                    variant="outline"
                    colorScheme="primary.blue"
                    onChange={(e) => {
                      setAdditionalInfo(e.target.value);
                    }}
                    type="text"
                    rounded="md"
                    width={{ base: "100%", md: "100%" }}
                    margin="0.5rem 0"
                    placeholder="Anything else you would like to add?"
                  />
                </FormControl>
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
            <MealDeliveryDetails
              mealRequestsInformation={mealRequestsInformation}
            />
          </GridItem>
        </SimpleGrid>
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
      </Stack>
    </Grid>
  );
};

export default MealDonationFormMealDetails;

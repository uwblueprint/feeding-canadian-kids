import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { validate } from "json-schema";
import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

import MealDeliveryDetails from "./MealDeliveryDetails";

import { MealRequest } from "../../../types/MealRequestTypes";
import { AuthenticatedUser, Contact } from "../../../types/UserTypes";
import OnsiteStaffSection from "../../common/OnsiteStaffSection";

type MealDonationFormContactInfoProps = {
  onsiteStaff: Contact[];
  setOnsiteStaff: React.Dispatch<React.SetStateAction<Contact[]>>;
  availableStaff: Contact[];
  handleNext: () => void;
  mealRequestsInformation: Array<MealRequest>;
};

const MealDonationFormContactInfo: React.FunctionComponent<MealDonationFormContactInfoProps> = ({
  onsiteStaff,
  setOnsiteStaff,
  availableStaff,
  handleNext,
  mealRequestsInformation,
}) => {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateData = () => {
    if (
      onsiteStaff.length === 0 ||
      onsiteStaff.some(
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

export default MealDonationFormContactInfo;

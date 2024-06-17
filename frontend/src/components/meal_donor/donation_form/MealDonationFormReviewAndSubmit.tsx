import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Divider,
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
  Stack,
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

import MealDeliveryDetails from "./MealDeliveryDetails";

import { MEAL_DONOR_DASHBOARD_PAGE } from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { MealRequest } from "../../../types/MealRequestTypes";
import { Contact, OnsiteContact } from "../../../types/UserTypes";
import { logPossibleGraphQLError } from "../../../utils/GraphQLUtils";
import { useGetDefaultPageForUser } from "../../../utils/useGetDefaultPageForUser";
import OnsiteContactSection from "../../common/OnsiteContactSection";

// Create the GraphQL mutation
const COMMIT_TO_MEAL_REQUEST = gql`
  mutation CommitToMealRequest(
    $requestor: ID!
    $mealRequestIds: [ID!]!
    $mealDescription: String!
    $additionalInfo: String!
    $donorOnsiteContacts: [ID!]!
  ) {
    commitToMealRequest(
      requestor: $requestor
      mealRequestIds: $mealRequestIds
      mealDescription: $mealDescription
      additionalInfo: $additionalInfo
      donorOnsiteContacts: $donorOnsiteContacts
    ) {
      mealRequests {
        id
      }
    }
  }
`;

type MealDonationFormReviewAndSubmitProps = {
  mealRequestsInformation: Array<MealRequest>;

  // From part 1
  onsiteContact: OnsiteContact[];

  // From part 2
  mealDescription: string;
  additionalInfo: string;

  // Other required data
  requestorId: string;
  primaryContact: Contact;

  // Switch tabs
  handleBack: () => void;
};

const MealDonationFormReviewAndSubmit: React.FunctionComponent<MealDonationFormReviewAndSubmitProps> = ({
  mealRequestsInformation,
  onsiteContact,
  mealDescription,
  additionalInfo,
  requestorId,
  primaryContact,
  handleBack,
}) => {
  const [commitToMealRequest] = useMutation<{
    commitToMealRequest: { id: string };
  }>(COMMIT_TO_MEAL_REQUEST);

  const toast = useToast();

  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const defaultPage = useGetDefaultPageForUser();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const handleSubmit = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await commitToMealRequest({
        variables: {
          requestor: requestorId,
          mealRequestIds: mealRequestsInformation.map(
            (mealRequest) => mealRequest.id,
          ),
          mealDescription,
          additionalInfo,
          donorOnsiteContacts: onsiteContact.map((contact) => contact.id),
        },
      });

      // On success, navigate to dashboard
      if (response.data) {
        toast({
          title: "Meal request commitment submitted!",
          status: "success",
          isClosable: true,
        });
        navigate(defaultPage);
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      toast({
        title: "Failed to commit to meal request. Please try again.",
        status: "error",
        isClosable: true,
      });
    }

    await setIsSubmitLoading(false);
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
            <Text fontSize="2xl" as="b">
              Step 3
            </Text>

            <FormControl>
              <FormLabel variant="form-label-bold">
                Primary Contact Name
              </FormLabel>
              <Text>{primaryContact.name}</Text>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} marginTop="1rem">
              <GridItem>
                <FormControl>
                  <FormLabel variant="form-label-bold">Email</FormLabel>
                  <Text>{primaryContact.email}</Text>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel variant="form-label-bold">Phone Number</FormLabel>
                  <Text>{primaryContact.phone}</Text>
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl marginTop="1rem">
              <FormLabel variant="form-label-bold">Food Description</FormLabel>
              <Text>{mealDescription}</Text>
            </FormControl>

            <FormControl marginTop="1rem">
              <FormLabel variant="form-label-bold">Additional Info</FormLabel>
              <Text>{additionalInfo || "None"}</Text>
            </FormControl>

            <FormControl marginTop="1rem">
              <FormLabel variant="form-label-bold">
                Contact Information
              </FormLabel>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Flex flexDir="column" gap="24px">
                  <Flex flexDir="column">
                    <TableContainer
                      border="1px solid #EDF2F7"
                      borderRadius="8px"
                    >
                      <Table>
                        <Thead>
                          <Tr
                            borderRadius="8px 8px 0 0"
                            h="40px"
                            background="primary.lightblue"
                          >
                            <Th
                              borderRadius="8px 0 0 0"
                              w="256px"
                              textTransform="none"
                            >
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
            </FormControl>
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
            onClick={handleSubmit}
            disabled={isSubmitLoading}
          >
            {isSubmitLoading ? <Spinner /> : "Submit"}
          </Button>
        </GridItem>
      </Stack>
    </Grid>
  );
};

export default MealDonationFormReviewAndSubmit;

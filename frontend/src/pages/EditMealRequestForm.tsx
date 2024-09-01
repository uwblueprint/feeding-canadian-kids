import {
  ApolloError,
  gql,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  NumberInput,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GraphQLError } from "graphql";
import React, { useContext, useEffect, useState } from "react";

import LoadingSpinner from "../components/common/LoadingSpinner";
import OnsiteContactsSection from "../components/common/OnsiteContactSection";
import AuthContext from "../contexts/AuthContext";
import { MealRequest, MealRequestsData } from "../types/MealRequestTypes";
import { Contact, OnsiteContact } from "../types/UserTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import useGetOnsiteContacts from "../utils/useGetOnsiteContacts";
import useIsWebView from "../utils/useIsWebView";

const GET_MEAL_REQUEST_BY_ID = gql`
  query get_meal_request_by_id($id: ID!, $requestorId: ID!) {
    getMealRequestById(id: $id, requestorId: $requestorId) {
      id
      status
      dropOffDatetime
      mealInfo {
        portions
        dietaryRestrictions
      }
      onsiteContacts {
        id
        name
        email
        phone
      }
      donationInfo {
        donor {
          info {
            organizationName
          }
        }
        commitmentDate
        mealDescription
        additionalInfo
        donorOnsiteContacts {
          id
          name
          email
          phone
        }
      }
      dateCreated
      dateUpdated
      deliveryInstructions
    }
  }
`;

const UPDATE_MEAL_REQUEST = gql`
  mutation UpdateMealRequest(
    $requestorId: ID!
    $mealRequestId: ID!
    $updatedDeliveryInstructions: String!
    $updatedMealInfoPortions: Int!
    $updatedMealInfoDietaryRestrictions: String!
    $updatedOnsiteContacts: [String!]!
  ) {
    updateMealRequest(
      requestorId: $requestorId
      mealRequestId: $mealRequestId
      deliveryInstructions: $updatedDeliveryInstructions
      mealInfo: {
        portions: $updatedMealInfoPortions
        dietaryRestrictions: $updatedMealInfoDietaryRestrictions
      }
      onsiteContacts: $updatedOnsiteContacts
    ) {
      mealRequest {
        id
        status
        dropOffDatetime
        mealInfo {
          portions
          dietaryRestrictions
        }
        onsiteContacts {
          id
          name
          email
          phone
        }
        donationInfo {
          donor {
            id
            info {
              email
            }
          }
        }
        deliveryInstructions
      }
    }
  }
`;

const UPDATE_MEAL_DONATION = gql`
  mutation UpdateMealRequestDonation(
    $requestorId: ID!
    $mealRequestId: ID!
    $mealDescription: String!
    $additionalInfo: String!
    $donorOnsiteContacts: [String!]!
  ) {
    updateMealRequestDonation(
      requestorId: $requestorId
      mealRequestId: $mealRequestId
      mealDescription: $mealDescription
      additionalInfo: $additionalInfo
      donorOnsiteContacts: $donorOnsiteContacts
    ) {
      mealRequest {
        id
        status
        dropOffDatetime
        mealInfo {
          portions
          dietaryRestrictions
        }
        onsiteContacts {
          id
          name
          email
          phone
        }
        donationInfo {
          donor {
            id
            info {
              email
            }
          }
          commitmentDate
          mealDescription
          additionalInfo
          donorOnsiteContacts {
            id
            name
            email
            phone
          }
        }
        deliveryInstructions
      }
    }
  }
`;

const EditMealRequestForm = ({
  open,
  onClose,
  mealRequestId,
  isEditDonation,
}: {
  open: boolean;
  onClose: (meal_request : MealRequest | undefined) => void;
  mealRequestId: string;
  isEditDonation: boolean;
}) => {
  // Get existing meal request information
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const requestorId = authenticatedUser?.id;

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isWebView = useIsWebView();
  const initialFocusRef = React.useRef(null);

  const [numberOfMeals, setNumberOfMeals] = useState<number>(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [mealDescription, setMealDescription] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [onsiteContactsLoading, setOnsiteContactsLoading] = useState(true);
  const [isUpcoming, setIsUpcoming] = useState(false);

  const toast = useToast();
  const [onsiteContacts, setOnsiteContacts] = useState<OnsiteContact[]>([]);
  const [mealDonorOnsiteContacts, setMealDonorOnsiteContacts] = useState<
    OnsiteContact[]
  >([]);

  // This is the list of available onsite contacts (for the logged in user! so could be either ASP or Meal donor onsite contacts)
  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(
    toast,
    setAvailableOnsiteContacts,
    setOnsiteContactsLoading,
  );

  const apolloClient = useApolloClient();

  useEffect(() => {
    async function getData() {
      try {
        const result = await apolloClient.query<MealRequestsData>({
          query: GET_MEAL_REQUEST_BY_ID,
          variables: {
            id: mealRequestId,
            requestorId,
          },
        });
        const mealRequest = result.data.getMealRequestById;
        setNumberOfMeals(mealRequest.mealInfo.portions);
        setDietaryRestrictions(mealRequest.mealInfo.dietaryRestrictions);
        setDeliveryInstructions(mealRequest.deliveryInstructions);
        setIsUpcoming(mealRequest.status === "UPCOMING");

        // If this meal request has a donation, only then we get this info
        if (mealRequest.donationInfo) {
          setMealDescription(mealRequest.donationInfo.mealDescription);
          setAdditionalNotes(mealRequest.donationInfo.additionalInfo);

          // Parse/stringify is to make a deep copy of the onsite staff
          setMealDonorOnsiteContacts(
            JSON.parse(
              JSON.stringify(mealRequest.donationInfo.donorOnsiteContacts),
            ),
          );
        }

        // Parse/stringify is to make a deep copy of the onsite staff
        setOnsiteContacts(
          JSON.parse(JSON.stringify(mealRequest.onsiteContacts)),
        );

        setLoading(false);
      } catch (error) {
        logPossibleGraphQLError(error as ApolloError, setAuthenticatedUser);
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestorId, mealRequestId, apolloClient]);

  const [updateMealRequest] = useMutation<MealRequestsData>(UPDATE_MEAL_REQUEST);
  const [updateMealDonation] = useMutation<MealRequestsData>(UPDATE_MEAL_DONATION);

  // For validation
  const validateData = () => {
    if (isEditDonation) {
      if (mealDescription === "") {
        setAttemptedSubmit(true);
        return false;
      }
      if (mealDonorOnsiteContacts.length < 0) {
        setAttemptedSubmit(true);
        return false;
      }
    } else  if (
        numberOfMeals <= 0 ||
        onsiteContacts.length < 0 ||
        onsiteContacts.some(
          (contact) =>
            !contact ||
            contact.name === "" ||
            contact.email === "" ||
            contact.phone === "",
        )
      ) {
        setAttemptedSubmit(true);
        return false;
      }

    setAttemptedSubmit(false);
    return true;
  };

  async function submitEditMealRequest() {
    try {
      setLoading(true);

      // Validate the data
      const valid = validateData();

      // If there are any errors, return
      if (!valid) {
        setLoading(false);
        return;
      }

      const response = await updateMealRequest({
        variables: {
          requestorId,
          mealRequestId,
          updatedDeliveryInstructions: deliveryInstructions,
          updatedMealInfoPortions: numberOfMeals,
          updatedMealInfoDietaryRestrictions: dietaryRestrictions,
          updatedOnsiteContacts: onsiteContacts.map((contact) => contact.id),
        },
      });
      const data = response.data;
      if (data) {
        toast({
          title: "Saved successfully",
          status: "success",
          isClosable: true,
        });
      } else {
        throw new GraphQLError("Failed to update meal request.");
      }
      setLoading(false);
      onClose(data.updateMealRequest.mealRequest);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      logPossibleGraphQLError(e as ApolloError, setAuthenticatedUser);
      toast({
        title: "Failed to update meal request.",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
      onClose(undefined);
    }
  }

  async function submitEditMealDonation() {
    try {
      setLoading(true);

      // Validate the data
      const valid = validateData();

      // If there are any errors, return
      if (!valid) {
        setLoading(false);
        return;
      }

      const response = await updateMealDonation({
        variables: {
          requestorId,
          mealRequestId,
          mealDescription,
          additionalInfo: additionalNotes,
          donorOnsiteContacts: mealDonorOnsiteContacts.map(
            (contact) => contact.id,
          ),
        },
      });
      const data = response.data;
      if (data) {
        toast({
          title: "Saved successfully",
          status: "success",
          isClosable: true,
        });
      } else {
        throw new GraphQLError("Failed to update meal donation information.");
      }
      setLoading(false);
      onClose(data.updateMealRequestDonation.mealRequest);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      logPossibleGraphQLError(e as ApolloError, setAuthenticatedUser);
      toast({
        title: "Failed to update meal donation information.",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
      onClose(undefined);
    }
  }

  if (isEditDonation) {
    return (
      <Modal initialFocusRef={initialFocusRef} isOpen={open} onClose={() => onClose(undefined)}>
        <ModalOverlay />
        <ModalContent
          maxWidth={{ base: "100%", md: "900px" }}
          padding={{ base: "10px", md: "40px" }}
        >
          {loading || onsiteContactsLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Text
                pb={{ base: 1, md: 5 }}
                pl={{ base: 6, md: 6 }}
                pt={{ base: 5, md: 8 }}
                variant={{
                  base: "mobile-display-xl",
                  md: "desktop-display-xl",
                }}
              >
                Edit My Donation
              </Text>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mt={3} isRequired>
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}
                  >
                    Food Description
                  </FormLabel>
                  <FormHelperText fontSize="xs" my={2}>
                    Please describe a typical meal you can provide:
                  </FormHelperText>
                  <Input
                    placeholder="Ex. Will be bringing 5 large cheese pizza's."
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                    ref={initialFocusRef}
                    isInvalid={attemptedSubmit && mealDescription === ""}
                    type="text"
                  />
                </FormControl>

                <FormControl mt={3}>
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}
                  >
                    Additional Notes
                  </FormLabel>
                  <Input
                    size="lg"
                    // Should we change this placeholder?
                    placeholder="Ex. A man with a beard will leave the food at the front door of the school."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </FormControl>
                {isWebView && <Divider />}
                <OnsiteContactsSection
                  onsiteInfo={mealDonorOnsiteContacts}
                  setOnsiteInfo={setMealDonorOnsiteContacts}
                  attemptedSubmit={attemptedSubmit}
                  availableStaff={availableOnsiteContacts}
                  dropdown
                />
              </ModalBody>

              <ModalFooter>
                <Button onClick={() => onClose(undefined)} mr={3} variant="outline">
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setAttemptedSubmit(true);
                    submitEditMealDonation();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal initialFocusRef={initialFocusRef} isOpen={open} onClose={() => onClose(undefined)}>
      <ModalOverlay />
      <ModalContent
        maxWidth={{ base: "100%", md: "900px" }}
        padding={{ base: "10px", md: "40px" }}
      >
        {loading || onsiteContactsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Text
              pb={{ base: 1, md: 5 }}
              pl={{ base: 6, md: 6 }}
              pt={{ base: 5, md: 8 }}
              variant={{
                base: "mobile-display-xl",
                md: "desktop-display-xl",
              }}
            >
              Edit Meal Request
            </Text>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text
                variant={{
                  base: "mobile-heading",
                  md: "desktop-heading",
                }}
              >
                Meal Information
              </Text>

              {!isUpcoming ? (
                <FormControl
                  mt={3}
                  mb={6}
                  isRequired
                  isInvalid={attemptedSubmit && numberOfMeals <= 0}
                >
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}
                  >
                    Number of meals
                  </FormLabel>
                  <Input
                    placeholder="Ex. 100"
                    value={numberOfMeals}
                    onChange={(e) => setNumberOfMeals(Number(e.target.value))}
                    ref={initialFocusRef}
                    type="number"
                    w="200px"
                  />
                </FormControl>
              ) : null}

              {!isUpcoming ? (
                <FormControl mt={3} mb={6}>
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}
                  >
                    Dietary restrictions
                  </FormLabel>
                  <Input
                    placeholder="Ex. Nut allergy, gluten free"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                  />
                </FormControl>
              ) : null}

              <FormControl mt={3} mb={6}>
                <FormLabel
                  variant={{
                    base: "mobile-form-label-bold",
                    md: "form-label-bold",
                  }}
                >
                  Delivery Notes
                </FormLabel>
                <Input
                  placeholder="Ex. Please knock on the door."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                />
                <br />
              </FormControl>
              {isWebView && <Divider />}
              <OnsiteContactsSection
                onsiteInfo={onsiteContacts}
                setOnsiteInfo={setOnsiteContacts}
                attemptedSubmit={attemptedSubmit}
                availableStaff={availableOnsiteContacts}
                dropdown
              />
            </ModalBody>

            <ModalFooter>
              <Button onClick={() => onClose(undefined)} mr={3} variant="outline">
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setAttemptedSubmit(true);
                  submitEditMealRequest();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditMealRequestForm;

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
import OnsiteStaffSection from "../components/common/OnsiteStaffSection";
import AuthContext from "../contexts/AuthContext";
import { MealRequestsData } from "../types/MealRequestTypes";
import { Contact, OnsiteContact } from "../types/UserTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import { isValidEmail } from "../utils/ValidationUtils";
import useGetOnsiteContacts from "../utils/useGetOnsiteContacts";
import useIsWebView from "../utils/useIsWebView";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";

const GET_MEAL_REQUEST_BY_ID = gql`
  query get_meal_request_by_id($id: ID!, $requestorId: ID!) {
    getMealRequestById(id: $id, requestorId: $requestorId) {
      id
      status
      dropOffDatetime
      dropOffLocation
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
        dropOffLocation
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

const EditMealRequestForm = ({
  open,
  onClose,
  mealRequestId,
}: {
  open: boolean;
  onClose: () => void;
  mealRequestId: string;
}) => {
  // Get existing meal request information
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const requestorId = authenticatedUser?.id;
  // const { data: queryData, error: queryDataError } = useQuery<MealRequestsData>(
  // logPossibleGraphQLError(queryDataError);
  // const existingMealRequest = queryData?.getMealRequestById;

  const [primaryContact, setPrimaryContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });
  const [onsiteInfo, setOnsiteInfo] = useState<Array<Contact>>([
    {
      name: "",
      phone: "",
      email: "",
    },
  ]);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isWebView = useIsWebView();
  const initialFocusRef = React.useRef(null);

  const [numberOfMeals, setNumberOfMeals] = useState<number>(0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>("");
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const [onsiteStaff, setOnsiteStaff] = useState<OnsiteContact[]>([]);
  // This is the list of available onsite staff
  const [availableOnsiteContacts, setAvailableOnsiteContacts] = useState<
    Array<Contact>
  >([]);
  useGetOnsiteContacts(toast, setAvailableOnsiteContacts, setLoading);

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

        // Parse/stringify is to make a deep copy of the onsite staff
        setOnsiteStaff(JSON.parse(JSON.stringify(mealRequest.onsiteContacts)));
        setLoading(false);
      } catch (error) {
        logPossibleGraphQLError(error as ApolloError);
      }
    }
    getData();
  }, [requestorId, mealRequestId, apolloClient]);

  const [updateMealRequest] = useMutation(UPDATE_MEAL_REQUEST);

  async function submitEditMealRequest() {
    try {
      setLoading(true);
      const response = await updateMealRequest({
        variables: {
          requestorId,
          mealRequestId,
          updatedDeliveryInstructions: deliveryInstructions,
          updatedMealInfoPortions: numberOfMeals,
          updatedMealInfoDietaryRestrictions: dietaryRestrictions,
          updatedOnsiteContacts: onsiteStaff.map((contact) => contact.id),
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
        throw new GraphQLError("Failed to save settings");
      }
      setLoading(false);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      logPossibleGraphQLError(e as ApolloError);
      toast({
        title: "Failed to save settings",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
    onClose();
  }

  const getMobileContactSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="8px">
      <FormControl isRequired mb={6}>
        <FormLabel variant="mobile-form-label-bold">Primary Contact</FormLabel>
        <Flex flexDir="column" gap="8px">
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && primaryContact.name === ""}
          >
            <Input
              variant="mobile-outline"
              value={primaryContact.name}
              onChange={(e) =>
                setPrimaryContact({ ...primaryContact, name: e.target.value })
              }
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && primaryContact.phone === ""}
          >
            <Input
              variant="mobile-outline"
              type="tel"
              value={primaryContact.phone}
              onChange={(e) =>
                setPrimaryContact({
                  ...primaryContact,
                  phone: e.target.value,
                })
              }
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && !isValidEmail(primaryContact.email)}
          >
            <Input
              variant="mobile-outline"
              type="email"
              value={primaryContact.email}
              onChange={(e) =>
                setPrimaryContact({
                  ...primaryContact,
                  email: e.target.value,
                })
              }
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_EMAIL}
            />
          </FormControl>
        </Flex>
      </FormControl>
    </Flex>
  );

  const getWebContactSection = (): React.ReactElement => (
    <>
      <Text variant="desktop-heading" pt={4} pb={3}>
        Contact Information
      </Text>

      <Flex flexDir="column" gap="24px">
        <Flex flexDir="column">
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && primaryContact.name === ""}
          >
            <FormLabel
              variant={{
                base: "mobile-form-label-bold",
                md: "form-label-bold",
              }}
            >
              Primary contact name
            </FormLabel>
            <Input
              value={primaryContact.name}
              placeholder={PLACEHOLDER_WEB_EXAMPLE_FULL_NAME}
              onChange={(e) =>
                setPrimaryContact({ ...primaryContact, name: e.target.value })
              }
            />
          </FormControl>
        </Flex>

        <Flex flexDir="row" gap="24px">
          <Flex flexDir="column" w="240px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.phone === ""}
              mb={6}
            >
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Phone number
              </FormLabel>
              <Input
                type="tel"
                value={primaryContact.phone}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    phone: e.target.value,
                  })
                }
              />
            </FormControl>
          </Flex>

          <Flex flexDir="column" w="519px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isValidEmail(primaryContact.email)}
            >
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Email address
              </FormLabel>
              <Input
                type="email"
                value={primaryContact.email}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_EMAIL}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    email: e.target.value,
                  })
                }
              />
            </FormControl>
          </Flex>
        </Flex>
      </Flex>
    </>
  );

  return (
    <>
      {/* <Button onClick={onOpen}>Edit Meal Request</Button> */}
      <Modal initialFocusRef={initialFocusRef} isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={{ base: "100%", md: "900px" }}
          padding={{ base: "10px", md: "40px" }}
        >
          {loading ? (
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

                <FormControl mt={3} mb={6} isRequired>
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}

                    // TODO: Hook this up to a state variable
                    // TODO: Setup correct validation for this
                    // isInvalid={attemptedSubmit && }
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

                <FormControl mt={3} mb={6} isRequired>
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

                <FormControl mt={3} mb={6} isRequired>
                  <FormLabel
                    variant={{
                      base: "mobile-form-label-bold",
                      md: "form-label-bold",
                    }}
                    // TODO: Setup correct validation for this
                    // isInvalid={attemptedSubmit && }
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
                <OnsiteStaffSection
                  onsiteInfo={onsiteStaff}
                  setOnsiteInfo={setOnsiteStaff}
                  attemptedSubmit={false /* todo change */}
                  availableStaff={availableOnsiteContacts}
                  dropdown
                />
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr={3} variant="outline">
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
    </>
  );
};

export default EditMealRequestForm;

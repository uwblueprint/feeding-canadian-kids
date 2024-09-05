import { gql, useMutation } from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  Divider,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Td,
  Text,
  Tr,
  Wrap,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GiMeal } from "react-icons/gi";
import {
  IoInformationCircleOutline,
  IoLocationOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { PiHourglass } from "react-icons/pi";
import { Navigate, useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";

import { MealRequestCalendarView } from "../components/common/MealRequestCalendarView";
import { CREATE_MEAL_REQUEST_PAGE, LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { MealRequest } from "../types/MealRequestTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";

const DELETE_MEAL_REQUEST = gql`
  mutation DeleteMealRequest($mealRequestId: ID!, $requestorId: String!) {
    deleteMealRequest(
      mealRequestId: $mealRequestId
      requestorId: $requestorId
    ) {
      mealRequest {
        id
      }
    }
  }
`;

type ASPCalendarProps = { authId: string };
const ASPCalendar = ({ authId }: ASPCalendarProps) => {
  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [
    currentlyEditingMealRequestId,
    setCurrentlyEditingMealRequestId,
  ] = useState<string | undefined>(undefined);

  const [itemToDelete, setItemToDelete] = useState<MealRequest | null>(null);
  const [shouldRefetchData, setShouldRefetchData] = useState(false);

  const {
    isOpen: deleteAlertIsOpen,
    onOpen: setDeleteAlertOpen,
    onClose: setDeleteAlertClosed,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const toast = useToast();

  const [
    deleteMealRequest,
    { loading: deleteMealRequestLoading, error: deleteMealRequestError },
  ] = useMutation(DELETE_MEAL_REQUEST, {
    awaitRefetchQueries: true,
  });

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate + "Z");
    return date.toDateString();
  }

  function formatTime(inputDate: string): string {
    const startTime = new Date(inputDate + "Z").toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const endDate = new Date(
      new Date(inputDate + "Z").getTime() + 60 * 60 * 1000,
    );

    const endTime = new Date(endDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${startTime} - ${endTime}`;
  }

  const handleEdit = (item: MealRequest) => () => {
    setIsEditModalOpen(true);
    setCurrentlyEditingMealRequestId(item.id);
  };

  const handleDelete = (item: MealRequest) => () => {
    setItemToDelete(item);
    setDeleteAlertOpen();
  };

  const deleteRequest = async (item: MealRequest) => {
    try {
      await deleteMealRequest({
        variables: {
          mealRequestId: item.id,
          requestorId: authId,
        },
      });
      setShouldRefetchData(true);
      setSelectedMealRequest(undefined);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting meal request:", error);
      logPossibleGraphQLError(error, setAuthenticatedUser);
      toast({
        title:
          "Sorry, something went wrong when trying to delete this meal request!",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={deleteAlertIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={setDeleteAlertClosed}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Meal Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cannot undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={setDeleteAlertClosed}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (itemToDelete) deleteRequest(itemToDelete);
                  setDeleteAlertClosed();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Stack direction="row">
        {currentlyEditingMealRequestId ? (
          <EditMealRequestForm
            open={isEditModalOpen}
            onClose={(meal_request) => {
              setIsEditModalOpen(false);
              setCurrentlyEditingMealRequestId(undefined);
              if (meal_request !== undefined) {
                setShouldRefetchData(true);
                setSelectedMealRequest(meal_request);
              }
            }}
            mealRequestId={currentlyEditingMealRequestId}
            isEditDonation={false}
          />
        ) : (
          ""
        )}
        <div style={{ width: "70%" }}>
          <MealRequestCalendarView
            aspId={authenticatedUser.id}
            showNextButton={false}
            onSelectNewMealRequest={(mealRequest: MealRequest) => {
              setSelectedMealRequest(mealRequest);
            }}
            allowMultipleSelection={false}
            shouldRefetch={shouldRefetchData}
            afterRefetch={() => {
              setShouldRefetchData(false);
            }}
            pageContext="asp"
          />
        </div>

        <div
          style={{
            width: "30%",
            margin: "20px",
            marginTop: "0px",
            marginRight: "0px",
          }}
        >
          {selectedMealRequest && (
            <>
              <Box textAlign="center" marginBottom={4}>
                {selectedMealRequest.donationInfo ? (
                  <Text fontSize="20px" as="b">
                    Upcoming Delivery
                  </Text>
                ) : (
                  <Text fontSize="20px" as="b">
                    Pending Donor
                  </Text>
                )}
              </Box>
              {selectedMealRequest.donationInfo ? (
                <Card padding={8} width="100%" variant="outline">
                  <Text fontSize="20px" as="b" color="#272D77">
                    {selectedMealRequest.mealInfo.portions}
                    {" Meals"}
                  </Text>
                  <HStack style={{ justifyContent: "space-between" }}>
                    <Text fontSize="14px">
                      {formatDate(selectedMealRequest.dropOffDatetime)}
                    </Text>
                    <Text fontSize="14px">
                      {formatTime(selectedMealRequest.dropOffDatetime)}
                    </Text>
                  </HStack>

                  <Table
                    variant="unstyled"
                    __css={{
                      "table-layout": "fixed",
                      width: "100%",
                      td: {
                        paddingLeft: 1,
                        verticalAlign: "top",
                        paddingBottom: 0,
                      },
                    }}
                    fontSize="14px"
                  >
                    <Tr>
                      <Td width="20px" paddingRight={10} paddingTop={4}>
                        <IoLocationOutline size={16} />
                      </Td>
                      <Td>
                        <Text>
                          {
                            selectedMealRequest?.requestor?.info
                              ?.organizationAddress
                          }
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td paddingTop={4}>
                        <IoPersonOutline size={16} />
                      </Td>
                      <Td>
                        <Text fontSize="15px">
                          <strong>Onsite Staff Contact</strong>
                        </Text>
                        {selectedMealRequest.onsiteContacts.map(
                          (staffMember) => (
                            <>
                              <Text>{staffMember?.name}</Text>
                              <Text>{staffMember?.email}</Text>
                              <Text>{staffMember?.phone}</Text>
                            </>
                          ),
                        )}
                      </Td>
                    </Tr>

                    <Tr>
                      <Td paddingTop={4}>
                        <IoMailOutline size={16} />
                      </Td>
                      <Td>
                        <Text fontSize="15px">
                          <strong>Delivery Notes:</strong>
                        </Text>
                        <Text>{selectedMealRequest.deliveryInstructions}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <GiMeal size={16} />
                      </Td>
                      <Td>
                        <Text fontSize="15px">
                          {" "}
                          <strong>Dietary Restrictions:</strong>{" "}
                        </Text>
                        {selectedMealRequest.mealInfo.dietaryRestrictions}
                      </Td>
                    </Tr>

                    {selectedMealRequest.donationInfo ? (
                      <Tr>
                        <Td paddingTop={4}>
                          <IoInformationCircleOutline size={16} />
                        </Td>
                        <Td>
                          <Text fontSize="15px">
                            <strong>Donor Provided Information:</strong>
                          </Text>

                          <Text fontWeight="semibold">Donor Name:</Text>
                          <Text>
                            {
                              selectedMealRequest.donationInfo.donor.info
                                ?.organizationName
                            }
                          </Text>

                          <Text fontWeight="semibold">Meal Description:</Text>
                          <Text>
                            {selectedMealRequest.donationInfo.mealDescription}
                          </Text>
                          <Text fontWeight="semibold">Additional Info:</Text>
                          <Text>
                            {" "}
                            {selectedMealRequest.donationInfo.additionalInfo}
                          </Text>
                          <Text fontWeight="semibold">
                            Donor Onsite Contacts:
                          </Text>
                          {selectedMealRequest?.donationInfo?.donorOnsiteContacts?.map(
                            (staffMember, index) => (
                              <div key={index}>
                                <Divider borderColor="gray.500" marginY={2} />
                                <Text>{staffMember.name}</Text>
                                <Text> {staffMember.email}</Text>
                                <Text> {staffMember.phone}</Text>
                              </div>
                            ),
                            // eslint-disable-next-line react/jsx-no-useless-fragment
                          ) ?? <></>}
                        </Td>
                      </Tr>
                    ) : null}
                  </Table>
                  <Box position="absolute" bottom={2} right={2}>
                    <HStack spacing={2}>
                      <Button
                        variant="link"
                        height="20px"
                        fontSize="14px"
                        textColor="black"
                        fontWeight="normal"
                        _hover={{ textDecoration: "underline" }}
                        onClick={handleEdit(selectedMealRequest)}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </Box>
                </Card>
              ) : (
                <Card padding={8} width="100%" variant="outline">
                  <Text fontSize="20px" as="b" color="#272D77">
                    {selectedMealRequest.mealInfo.portions}
                    {" Meals"}
                  </Text>
                  <HStack style={{ justifyContent: "space-between" }}>
                    <Text fontSize="14px">
                      {formatDate(selectedMealRequest.dropOffDatetime)}
                    </Text>
                    <Text fontSize="14px">
                      {formatTime(selectedMealRequest.dropOffDatetime)}
                    </Text>
                  </HStack>
                  <HStack marginTop={5}>
                    <PiHourglass size={16} />
                    <Text fontSize="14px">No committed meal donor</Text>
                  </HStack>
                  <Box position="absolute" bottom={2} right={2}>
                    <HStack spacing={2}>
                      <Button
                        variant="link"
                        height="20px"
                        fontSize="14px"
                        textColor="black"
                        fontWeight="normal"
                        _hover={{ textDecoration: "underline" }}
                        onClick={handleEdit(selectedMealRequest)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        height="20px"
                        fontSize="14px"
                        textColor="red"
                        fontWeight="normal"
                        _hover={{ textDecoration: "underline" }}
                        onClick={handleDelete(selectedMealRequest)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Box>
                </Card>
              )}
            </>
          )}
        </div>
      </Stack>
    </>
  );
};

export default ASPCalendar;

import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Toast,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { HOME_PAGE } from "../../constants/Routes";
import NotFound from "../pages/NotFound";

type GetOnboardingRequest = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  role: string;
  status: string;
};

const SetPassword = (): React.ReactElement => {
  const [
    onboardingRequestByIdData,
    setOnboardingRequestByIdData,
  ] = useState<GetOnboardingRequest>();

  const [
    onboardingRequestByIdDataError,
    setOnboardingRequestByIdDataError,
  ] = useState(false);
  const [notMatching, setNotMatching] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmGray, setConfirmGray] = useState(false);
  const [description, setDescription] = useState(
    "Please enter your new password. The password must be at least 8 characters.",
  );
  const regex = "^[0-9a-fA-F]{24}$";
  const toast = useToast();
  const { objectID: objectId } = useParams();

  //   const GET_OBJECT_ID = gql`
  //   query getOnboardingRequestID {
  //     getOnboardingRequestById(id: "${objectId}") {
  //       contactName
  //       contactEmail
  //       contactPhone
  //       role
  //       dateSubmitted
  //       status
  //     }
  //   }
  // `;

  // useQuery(GET_OBJECT_ID, {
  //   onCompleted: (res) => {
  //     setOnboardingRequestByIdData(res.getOnboardingRequestById[0]);
  //   },
  //   onError: () => {
  //     setOnboardingRequestByIdDataError(true);
  //   },
  // });

  useEffect(() => {
    async function fetchObjectData() {
      const client = new ApolloClient({
        uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
        cache: new InMemoryCache(),
      });

      const { data } = await client.query({
        query: gql`
          query getOnboardingRequestID {
            getOnboardingRequestById(id: "${objectId}") {
              contactName
              contactEmail
              contactPhone
              role
              dateSubmitted
              status
            }
          }
        `,
      });

      return data;
    }
    fetchObjectData()
      .then((res) => {
        if (res.getOnboardingRequestById[0].status !== "Approved") {
          console.log(res.getOnboardingRequestById[0]);
          toast({
            title: "Error",
            description: `Sorry, your onboarding request has not been approved. Please wait for a response from admin`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setConfirmGray(true);
          setDescription(
            `Sorry, your onboarding request has not been approved. Please wait for a response from admin`,
          );
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: `Sorry, we could not find an onboarding request associated with the object ID: ${objectId}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setConfirmGray(true);
        setDescription(
          `Sorry, we could not find an onboarding request associated with the object ID: ${objectId}`,
        );
      });
  }, []);

  // // checking if objectID is valid and if it is, getting the onboarding request
  // if (objectId?.toString().match(regex) === null) {
  //   return <NotFound />;
  // }

  const onResetPasswordClick = () => {
    setNotMatching(password !== confirm);
    setTooShort(password.length < 8);
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent={{ base: "center", md: "flex-start" }}
      alignItems="center"
      marginBottom="50px"
    >
      <VStack
        justify="space-between"
        border={{ base: "0px", md: "1px" }}
        borderColor="#D6D6D6"
        borderRadius="5%"
        padding={{ base: "4% 3% 4% 3%", md: "4% 7% 4% 7%" }}
        width={{ base: "80%", md: "40%" }}
        height="fit-content"
      >
        <Text
          textAlign="center"
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Set your password
        </Text>
        <Text
          pb={5}
          textAlign="center"
          variant={{ base: "mobile-caption", md: "desktop-caption" }}
          textColor={confirmGray ? "red" : "black"}
        >
          {description}
        </Text>
        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl pb={5} isRequired isInvalid={notMatching || tooShort}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Enter new password
              </FormLabel>
              <Input
                variant="outline"
                type="password"
                value={password}
                outlineColor={confirmGray ? "red" : ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              {tooShort ? (
                <FormErrorMessage>
                  <Text
                    variant={{
                      base: "mobile-caption",
                      md: "desktop-caption",
                    }}
                  >
                    Password must be at least 8 characters long.
                  </Text>
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Box>
            <FormControl pb={12} isRequired isInvalid={notMatching || tooShort}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Confirm new password
              </FormLabel>
              <Input
                variant="outline"
                type="password"
                value={confirm}
                outlineColor={confirmGray ? "red" : ""}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {notMatching ? (
                <FormErrorMessage>
                  <Text
                    variant={{
                      base: "mobile-caption",
                      md: "desktop-caption",
                    }}
                  >
                    Passwords do not match.
                  </Text>
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
        </Flex>
        <VStack pb={5} width="100%">
          <Button
            onClick={onResetPasswordClick}
            width={{ base: "100%", md: "90%" }}
            pt={1}
            pb={1}
            backgroundColor="primary.blue"
            disabled={confirmGray}
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              Confirm
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default SetPassword;

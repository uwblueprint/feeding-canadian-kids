import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackgroundImage from "../../assets/background.png";
import { LOGIN_PAGE } from "../../constants/Routes";

const SetPassword = (): React.ReactElement => {
  const [notMatching, setNotMatching] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  const { objectID: objectId } = useParams();

  const GET_ONBOARDING_REQUEST = gql`
    query GetOnboardingRequestById{
      getOnboardingRequestById(id: "${objectId}"
          
        ) {
        id
        info {
          email
          organizationAddress
          organizationName
          organizationDesc
          role
          roleInfo {
            aspInfo {
              numKids
            }
            donorInfo {
              type
              tags
            }
          }
          primaryContact {
            name
            phone
            email
          }
          onsiteContacts {
            name
            phone
            email
          }
        }
        dateSubmitted
        status
      }
    }
  `;

  const REGISTER_USER = gql`
    mutation register(
      $email: String!
      $password: String!
      $requestId: String!
    ) {
      register(email: $email, password: $password, requestId: $requestId) {
        registeredUser {
          accessToken
          id
          info {
            email
            organizationAddress
            organizationName
            organizationDesc
            role
            roleInfo {
              aspInfo {
                numKids
              }
              donorInfo {
                type
                tags
              }
            }
            primaryContact {
              name
              phone
              email
            }
            onsiteContacts {
              name
              phone
              email
            }
          }
        }
      }
    }
  `;

  const { data: onboardingData, error: onboardingError } = useQuery(
    GET_ONBOARDING_REQUEST,
  );

  

  const [register, { loading: registerLoading }] = useMutation(REGISTER_USER);

  console.log(onboardingData);

  const dataStatus = () => {
    return onboardingData?.getOnboardingRequestById?.status !== "Approved";
  };

  const handleRegister = async () => {
    try {
      await register({
        variables: {
          email: onboardingData?.getOnboardingRequestById?.info.email,
          password,
          requestId: objectId,
        },
      });
      navigate(LOGIN_PAGE);
    } catch (e: unknown) {
      toast({
        title: "Failed to set password. Please try again.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const onResetPasswordClick = async () => {
    const passwordMatchCheck = password !== confirm;
    const passwordLengthCheck = password.length < 8;

    setNotMatching(passwordMatchCheck);
    setTooShort(passwordLengthCheck);

    if (passwordLengthCheck || passwordMatchCheck) return;

    handleRegister();
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent={{ base: "center", md: "flex-start" }}
      alignItems="center"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <VStack
        justify="space-between"
        border={{ base: "0px", md: "1px" }}
        borderColor="#D6D6D6"
        borderRadius="5%"
        padding={{ base: "4% 3% 4% 3%", md: "4% 7% 4% 7%" }}
        width={{ base: "80%", md: "40%" }}
        height="fit-content"
        style={{
          background: "white",
        }}
      >
        <Text
          textAlign="center"
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Set your password
        </Text>
        {onboardingError ? (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
            textColor="red"
          >
            Sorry, we could not find an onboarding request associated with the
            object ID.
          </Text>
        ) : (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
            textColor={dataStatus() ? "red" : "black"}
          >
            {onboardingData?.getOnboardingRequestById?.status === "Approved"
              ? "Please enter your new password. The password must be at least 8 characters long."
              : "Sorry, your onboarding request has not been approved. Please wait for a response from admin."}
          </Text>
        )}

        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl
              pb={5}
              isRequired
              isInvalid={
                notMatching || tooShort || !!onboardingError || dataStatus()
              }
            >
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
                onChange={(e) => setPassword(e.target.value)}
              />
              {tooShort && (
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
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl
              pb={12}
              isRequired
              isInvalid={
                notMatching || tooShort || !!onboardingError || dataStatus()
              }
            >
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
                // outlineColor={confirmGray ? "red" : ""}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {notMatching && (
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
              )}
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
            disabled={!!onboardingError || dataStatus()}
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              {registerLoading ? "Loading..." : "Confirm"}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default SetPassword;

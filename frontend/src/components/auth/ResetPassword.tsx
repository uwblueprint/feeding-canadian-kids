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

const ResetPassword = (): React.ReactElement => {
  const [notMatching, setNotMatching] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { objectID: objectId } = useParams();

  const GET_USER = gql`
  query GetUserByID{
    getUserById(id: "${objectId}"
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
    }
  }
`;

  const RESET_PASSWORD = gql`
    mutation ResetPassword($email: String!, $password: String!) {
      resetPassword(email: $email, password: $password) {
        success
      }
    }
  `;

  const { data: userData, error: getUserError } = useQuery(GET_USER);

  const [resetPassword, { loading: resetPasswordLoading }] =
    useMutation(RESET_PASSWORD);

  const handleResetPassword = async () => {
    try {
      await resetPassword({
        variables: {
          email: userData?.getUserById.info.email,
          password,
        },
      });
      navigate(LOGIN_PAGE);
    } catch (e: unknown) {
      toast({
        title: "Failed to reset password. Please try again",
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

    handleResetPassword();
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
        width={{ base: "80%", md: "45%" }}
        height="fit-content"
        style={{
          background: "white",
        }}
      >
        <Text
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Reset password
        </Text>
        <Text
          pb={5}
          textAlign="center"
          variant={{ base: "mobile-caption", md: "desktop-caption" }}
          textColor={getUserError ? "red" : "black"}
        >
          {getUserError
            ? "User does not exist. Please visit our join page to initiate a request to join."
            : "Please enter your new password. The password must be at least 8 characters."}
        </Text>
        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl
              pb={5}
              isRequired
              isInvalid={notMatching || tooShort || !!getUserError}
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
                    variant={{ base: "mobile-caption", md: "desktop-caption" }}
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
              isInvalid={notMatching || tooShort || !!getUserError}
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
                onChange={(e) => setConfirm(e.target.value)}
              />
              {notMatching && (
                <FormErrorMessage>
                  <Text
                    variant={{ base: "mobile-caption", md: "desktop-caption" }}
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
            disabled={!!getUserError}
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              {resetPasswordLoading ? "Loading..." : "Reset"}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default ResetPassword;

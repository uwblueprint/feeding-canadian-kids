import { gql, useMutation } from "@apollo/client";
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
  useToast
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Navigate } from 'react-router-dom';

import authAPIClient from "../../APIClients/AuthAPIClient";
import { LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

const RESET_PASSWORD = gql `
    mutation ResetPassword($email: String!, $password: String!) {
      resetPassword(email: $email, password: $password) {
        success
      }
    }
  `;

import BackgroundImage from "../../assets/background.png";

const ResetPassword = (): React.ReactElement => {
  const [notMatching, setNotMatching] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [complete, setComplete] = useState(false);
  const toast = useToast();

  const { authenticatedUser } = useContext(AuthContext)

  if (!authenticatedUser) {
    return (
      <>
        {toast({
          title: 'User not found.',
          description: "Make sure you are logged in.",
          status: 'error',
          duration: 9000,
          isClosable: false,
        })}
      </>
    )
  }

  const [resetPassword] = useMutation<{ resetPassword: { success: boolean } }>(RESET_PASSWORD);

  const onResetPasswordClick = async () => {
    setNotMatching(password !== confirm);
    setTooShort(password.length < 8);

    const success = await authAPIClient.resetPassword(
      String(authenticatedUser?.email),
      String(password),
      resetPassword,
    );
    if (!success) {
      toast({
          title: 'An error occured',
          description: "Password not changed.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
    }
    setComplete(success);
  };

  if (complete) return <Navigate replace to={LOGIN_PAGE} />;

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
        >
          Please enter your new password. The password must be at least 8
          characters.
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
                onChange={(e) => setPassword(e.target.value)}
              />
              {tooShort ? (
                <FormErrorMessage>
                  <Text
                    variant={{ base: "mobile-caption", md: "desktop-caption" }}
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
                onChange={(e) => setConfirm(e.target.value)}
              />
              {notMatching ? (
                <FormErrorMessage>
                  <Text
                    variant={{ base: "mobile-caption", md: "desktop-caption" }}
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
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              Reset
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default ResetPassword;

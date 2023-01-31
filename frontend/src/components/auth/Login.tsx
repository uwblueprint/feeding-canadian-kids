import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthenticatedUser }>(
    LOGIN_WITH_GOOGLE,
  );

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      login,
    );
    setAuthenticatedUser(user);
  };

  const onSignUpClick = () => {
    navigate(SIGNUP_PAGE);
  };

  const onGoogleLoginSuccess = async (idToken: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      idToken,
      loginWithGoogle,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Navigate replace to={HOME_PAGE} />;
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        justify="space-between"
        border={{ base: "0px", md: "1px" }}
        borderColor="#D6D6D6"
        borderRadius="5%"
        padding={{ base: "4% 3% 4% 3%", md: "4% 7% 4% 7%" }}
        width={{ base: "80%", md: "40%" }}
        height={{ base: "60%", md: "75%" }}
      >
        <Text
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Log in to account
        </Text>
        <Text pb={5} textAlign="center" fontSize={{ base: "12px", md: "16px" }}>
          Please enter your account details to log in.
        </Text>
        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl pb={5} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Email Address
              </FormLabel>
              <Input
                height={{ base: "38px", md: "51px" }}
                fontSize={{ base: "14px", md: "18px" }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl pb={2} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Password
              </FormLabel>
              <Input
                height={{ base: "38px", md: "51px" }}
                fontSize={{ base: "14px", md: "18px" }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Box>
          <Text
            pb={12}
            variant={{ base: "mobile-xs", md: "desktop-xs" }}
            textDecoration="underline"
          >
            Forgot Password?
          </Text>
        </Flex>
        <VStack pb={5} width="100%">
          <Button
            onClick={onLogInClick}
            width={{ base: "100%", md: "90%" }}
            pt={1}
            pb={1}
            backgroundColor="#272D77"
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              Log in
            </Text>
          </Button>
          <HStack>
            <Text variant={{ base: "mobile-xs", md: "desktop-xs" }}>
              Don’t have an account?
            </Text>
            <Text
              variant={{ base: "mobile-xs", md: "desktop-xs" }}
              textDecoration="underline"
            >
              Sign up now.
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Login;

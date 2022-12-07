import { gql, useMutation } from "@apollo/client";

import {
  Box,
  Button,
  Flex,
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
      border='1px'
      borderColor='#D6D6D6'
      borderRadius='5%'
      padding='5% 5% 5% 5%'>
        <Text fontFamily="Dimbo" fontSize="3xl" as="b">Log in to account</Text>
        <Text>Please enter your account details to log in.</Text>
        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
        <Box>
          <Text>Email Address</Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box>
          <Text>Password</Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
          <Text textDecoration="underline">Forgot Password?</Text>
        </Flex>
        <Button
          onClick={onLogInClick}
          width="100%"
          backgroundColor="#272D77"
        >
          <Text color="white">
            Log In
          </Text>
        </Button>
        <HStack>
          <Text>Don’t have an account?</Text>
          <Text textDecoration="underline">Sign up now.</Text>
        </HStack>
      </VStack>
    </Flex>
  );
};

export default Login;

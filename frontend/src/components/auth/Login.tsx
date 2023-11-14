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
import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import BackgroundImage from "../../assets/background.png";
import { DASHBOARD_PAGE, JOIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser, LoginData } from "../../types/UserTypes";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $idToken: String!) {
    login(email: $email, password: $password, idToken: $idToken) {
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
          active
        }
      }
    }
  }
`;

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [login] = useMutation<{ login: LoginData }>(LOGIN);

  const onLogInClick = async () => {
    let user: AuthenticatedUser | null = null;
    try {
      user = await authAPIClient.login(email, password, "", login);
      setError(false);
    } catch (e: unknown) {
      setError(true);
    }
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Navigate replace to={DASHBOARD_PAGE} />;
  }

  return (
    <Flex
      flexDirection="column"
      padding="100px 0px"
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
        style={{ background: "white" }}
      >
        <Text
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Log in to account
        </Text>
        {error ? (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
            color="secondary.critical"
          >
            The email or password you entered is incorrect. Please try again.
          </Text>
        ) : (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
          >
            Please enter your account details to log in.
          </Text>
        )}
        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl pb={5} isRequired isInvalid={error}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Email Address
              </FormLabel>
              <Input
                variant="outline"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl pb={2} isRequired isInvalid={error}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Password
              </FormLabel>
              <Input
                variant="outline"
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
            backgroundColor="primary.blue"
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="text.white"
            >
              Log in
            </Text>
          </Button>
          <HStack>
            <Text variant={{ base: "mobile-xs", md: "desktop-xs" }}>
              Don’t have an account?
            </Text>
            <Link to={JOIN_PAGE}>
              <Text
                variant={{ base: "mobile-xs", md: "desktop-xs" }}
                textDecoration="underline"
              >
                Sign up now.
              </Text>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Login;

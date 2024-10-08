import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import BackgroundImage from "../../assets/background.png";
import { LOGIN_PAGE } from "../../constants/Routes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import { isValidEmail } from "../../utils/ValidationUtils";

const ForgotPassword = () => {
  const toast = useToast();

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);

  const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($email: String!) {
      forgotPassword(email: $email) {
        success
      }
    }
  `;

  const [
    forgotPassword,
    { loading: forgotPasswordLoading, error },
  ] = useMutation(FORGOT_PASSWORD);

  const navigate = useNavigate();
  const handleResetPassword = async () => {
    try {
      await forgotPassword({
        variables: {
          email,
        },
      });
      logPossibleGraphQLError(error, () => {});
      toast({
        title: "Please check your email for a link to reset your password!",
        status: "success",
        isClosable: true,
      });
      navigate(LOGIN_PAGE);
    } catch (e: unknown) {
      logPossibleGraphQLError(e, () => {});
      logPossibleGraphQLError(error, () => {});
      toast({
        title: "Failed to send email. Please try again",
        status: "error",
        isClosable: true,
      });
    }
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
          textAlign="center"
          variant={{ base: "mobile-display-xl", lg: "desktop-display-xl" }}
          w={{ base: "224px", md: "400px", lg: "388px" }}
          marginBottom="32px"
        >
          Forgot password?
        </Text>
        {!emailError && (
          <Text
            textAlign="center"
            paddingBottom="32px"
            w={{ base: "224px", lg: "388px" }}
            variant={{ base: "mobile-caption-2", lg: "desktop-caption" }}
          >
            Enter an email address associated with a Feeding Canadian Kids
            account and we’ll send an email with further instructions.
          </Text>
        )}

        {emailError && (
          <Text
            textAlign="center"
            paddingBottom="32px"
            color="#E53E3E"
            w={{ base: "224px", lg: "388px" }}
            variant={{ base: "mobile-caption-2", lg: "desktop-caption" }}
          >
            Sorry, we couldn’t find an account associated with that email
            address. Please try again.
          </Text>
        )}

        <FormControl
          w={{ base: "224px", lg: "388px" }}
          paddingBottom="64px"
          isRequired
          isInvalid={emailError}
        >
          <FormLabel
            variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
          >
            Email Address
          </FormLabel>
          <Input
            w={{ base: "224px", lg: "388px" }}
            h={{ base: "38px", lg: "51px" }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <Button
          size="lg"
          type="submit"
          w={{ base: "224px", lg: "344px" }}
          paddingTop="22px"
          paddingBottom="22px"
          marginBottom="8px"
          variant={{ base: "mobile-button-bold", lg: "mobile-button-bold-2" }}
          color="white"
          bgColor="#272D77"
          _hover={{ bgColor: "#272D77" }}
          borderRadius="6px"
          disabled={forgotPasswordLoading}
          onClick={() => {
            if (isValidEmail(email)) {
              setEmailError(false);
              handleResetPassword();
            } else {
              setEmailError(true);
            }
          }}
        >
          {forgotPasswordLoading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="primary.green"
              size="lg"
            />
          ) : (
            "Reset"
          )}
        </Button>
        {!emailError && (
          <Text
            alignSelf={{ base: "center", lg: "unset" }}
            textAlign={{ base: "center", lg: "unset" }}
            marginTop="0"
            variant={{ base: "mobile-caption", lg: "desktop-caption" }}
          >
            Already have an account?{" "}
            <Link color="black" textDecoration="underline" href="/login">
              Log in now.
            </Link>
          </Text>
        )}
        {emailError && (
          <Text
            alignSelf={{ base: "center", lg: "unset" }}
            textAlign={{ base: "center", lg: "unset" }}
            marginTop="0"
            variant={{ base: "mobile-caption", lg: "desktop-caption" }}
          >
            Don’t have an account?{" "}
            <Link color="black" textDecoration="underline" href="/login">
              Sign up now.
            </Link>
          </Text>
        )}
      </VStack>
    </Flex>
  );
};

export default ForgotPassword;

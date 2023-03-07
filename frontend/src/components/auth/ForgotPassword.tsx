import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { isValidEmail, trimWhiteSpace } from "../../utils/ValidationUtils";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  console.log(email);
  const [emailError, setEmailError] = React.useState(false);
  // reload the page on email error change

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "304px", lg: "580px" }}
        h={{ base: "500px", lg: "522px" }}
        p={{ base: "16px", lg: "64px" }}
        m={{ base: "125px 0", lg: "128px 0" }}
        borderRadius="8px"
        boxShadow={{
          base: "",
          lg:
            "0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        alignItems="center"
        alignContent="center"
        textAlign="center"
      >
        <Text
          alignSelf="center"
          variant={{ base: "mobile-display-xl", lg: "desktop-display-xl" }}
          w={{ base: "224px", md: "400px", lg: "388px" }}
          marginBottom="32px"
        >
          Forgot password?
        </Text>
        {!emailError && (
          <Text
            marginBottom="32px"
            w={{ base: "224px", lg: "388px" }}
            variant={{ base: "mobile-caption-2", lg: "desktop-caption" }}
          >
            Enter an email address associated with a Feeding Canadian Kids
            account and we’ll send an email with further instructions.
          </Text>
        )}

        {emailError && (
          <Text
            marginBottom="32px"
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
          marginBottom="64px"
          isRequired
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
          onClick={() => {
            console.log("clicked");
            if (isValidEmail(email)) {
              setEmailError(false);
            } else {
              setEmailError(true);
            }
          }}
        >
          Reset
        </Button>
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
      </Flex>
    </Center>
  );
};

export default ForgotPassword;

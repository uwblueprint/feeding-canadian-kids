import { Center, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

import BackgroundImage from "../../assets/background.png";
import { HOME_PAGE } from "../../constants/Routes";

const JoinSuccess = (): React.ReactElement => {
  return (
    <Center
      h="100vh"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Flex
        flexDir="column"
        alignSelf={{ base: "center", md: "flex-start" }}
        p={{ base: "24px", md: "48px" }}
        m="0 48px"
        gap={{ base: "14px", md: "18px" }}
        borderRadius="8px"
        width={{ base: "85%", md: "50%" }}
        boxShadow="0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)"
        style={{
          backgroundColor: "white",
        }}
      >
        <Text variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}>
          Account Pending
        </Text>
        <Text variant={{ base: "desktop-xs", md: "desktop-caption" }}>
          Thanks for signing up! The Feeding Canadian Kids Team is in the
          process of approving your After School Program account and will get
          back to you shortly through email.
        </Text>
        <Text variant={{ base: "desktop-xs", md: "desktop-caption" }}>
          <Link color="#272D77" textDecoration="underline" href={HOME_PAGE}>
            Take me back to landing page
          </Link>
        </Text>
      </Flex>
    </Center>
  );
};

export default JoinSuccess;

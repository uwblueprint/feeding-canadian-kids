import { Center, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

import { HOME_PAGE } from "../../constants/Routes";

const JoinSuccess = (): React.ReactElement => {
  return (
    <Center h="100vh">
      <Flex
        flexDir="column"
        p={{ base: "24px", md: "48px" }}
        m="0 48px"
        gap={{ base: "14px", md: "18px" }}
        borderRadius="8px"
        boxShadow="0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)"
      >
        <Text variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}>
          Account Awaiting Approval
        </Text>
        <Text variant={{ base: "desktop-xs", md: "desktop-caption" }}>
          Thank you for signing up with Feeding Canadian Kids. Please check your
          email regularly for further instructions from admin on the approval of
          your account.
        </Text>
        <Text variant={{ base: "desktop-xs", md: "desktop-caption" }}>
          <Link color="#272D77" textDecoration="underline" href={HOME_PAGE}>
            Return to home
          </Link>
        </Text>
      </Flex>
    </Center>
  );
};

export default JoinSuccess;

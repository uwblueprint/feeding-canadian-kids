import { Text, VStack } from "@chakra-ui/react";
import React from "react";

const TitleSection = (): React.ReactElement => {
  return (
    <div>
      <VStack
        spacing={4}
        alignItems="center"
        height="fit-content"
        style={{
          background: "white",
        }}
        padding={{ base: "1rem", lg: "2rem" }}
      >
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-display-xl"
          color="primary.blue"
          as="b"
        >
          Create a meal request
        </Text>

        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-body"
          textAlign="center"
          maxWidth="100%"
        >
          Tell us a little bit about your requirements and we&apos;ll connect
          you with a meal donor. This program aims to support kids age 6 to 12.
        </Text>
      </VStack>
    </div>
  );
};

export default TitleSection;

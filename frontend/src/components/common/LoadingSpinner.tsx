import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const LoadingSpinner = (): React.ReactElement => (
    <Flex gap="24px" alignContent="center">
      <Text height="24px" margin="12px">
        Loading...
      </Text>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="primary.green"
        size="xl"
      />
    </Flex>
  );

export default LoadingSpinner;

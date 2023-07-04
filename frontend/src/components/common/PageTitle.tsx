import { Text } from "@chakra-ui/react";
import React from "react";

const PageTitle = ({ children }: { children: string }): React.ReactElement => {
  return (
    <Text
      alignSelf={{ base: "center", lg: "unset" }}
      variant="desktop-display-xl"
      color="primary.blue"
    >
      {children}
    </Text>
  );
};

export default PageTitle;

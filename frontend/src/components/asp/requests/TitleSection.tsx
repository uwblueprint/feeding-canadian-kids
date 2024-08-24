import { Text, VStack } from "@chakra-ui/react";
import React from "react";

interface TitleSectionProps {
  title: string;
}

const TitleSection = ({ title }: TitleSectionProps): React.ReactElement => (
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
        {title}
      </Text>
    </VStack>
  </div>
);

export default TitleSection;

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
} from "@chakra-ui/react";
import React from "react";

import TitleSection from "../components/asp/requests/TitleSection";

const getTitleSection = (): React.ReactElement => {
  return (
    <Flex flexDir="column" width="100%">
      <Flex width="100%" justifyContent="flex-end">
        <Button
          width="10%"
          height={{ base: "40px", lg: "45px" }}
          mt="24px"
          color="text.black"
          bgColor="background.white"
          borderRadius="6px 0 0 6px"
          border="1px solid"
          borderColor="text.black"
          _hover={{
            bgColor: "gray.gray83",
          }}
          onClick={() => {
            console.log("clicked");
          }}
        >
          Meal Donors
        </Button>
        <Button
          width="10%"
          height={{ base: "40px", lg: "45px" }}
          mt="24px"
          color="text.white"
          bgColor="primary.blue"
          borderRadius="0 6px 6px 0"
          border="1px solid"
          borderColor="text.black"
          _hover={{
            bgColor: "secondary.blue",
          }}
          onClick={() => {
            console.log("clicked");
          }}
        >
          After School Program
        </Button>
      </Flex>
      <TitleSection
        title="Onboarding Requests"
        description="These are After School Program onboarding requests"
      />
    </Flex>
  );
};

const OnboardingRequestsPage = (): React.ReactElement => {
  return (
    <Flex
      flexDir="column"
      w={{ base: "100%" }}
      p={{ base: "24px", sm: "36px", lg: "48px" }}
      gap={{ base: "20px", lg: "32px" }}
      borderRadius="8px"
      bgColor="background.white"
      justifyContent="center"
      alignItems="center"
    >
      {getTitleSection()}
    </Flex>
  );
};

export default OnboardingRequestsPage;

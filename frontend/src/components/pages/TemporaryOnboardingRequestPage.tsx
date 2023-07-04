import { useQuery } from "@apollo/client";
import { Button, Center, Flex } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { graphql } from "../../__generated__";
import { DASHBOARD_PAGE } from "../../constants/Routes";
import PageTitle from "../common/PageTitle";

// For seeing graphql codegen: https://the-guild.dev/graphql/codegen/docs/guides/react-vue
const GET_ALL_ONBOARDING_REQUESTS = graphql(`
  query GetAllOnboardingRequests {
    getAllOnboardingRequests {
      id
      info {
        email
        organizationAddress
        organizationName
        organizationDesc
        role
      }
      dateSubmitted
      status
    }
  }
`);

const TemporaryOnboardingRequestPage = (): React.ReactElement => {
  const { data, error } = useQuery(GET_ALL_ONBOARDING_REQUESTS);

  const navigate = useNavigate();
  console.log(data);

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "980px" }}
        p={{ base: "24px", sm: "36px", lg: "48px" }}
        gap={{ base: "20px", lg: "32px" }}
        borderRadius="8px"
        bgColor="background.white"
      >
        <PageTitle>Temporary Onboarding Request Management</PageTitle>
        <Button onClick={() => navigate(DASHBOARD_PAGE)} maxWidth="300px">
          Back To Dashboard
        </Button>
      </Flex>
    </Center>
  );
};

export default TemporaryOnboardingRequestPage;

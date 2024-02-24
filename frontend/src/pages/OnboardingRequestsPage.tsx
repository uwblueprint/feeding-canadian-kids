import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { on } from "events";
import React from "react";

import { BanIcon } from "../assets/icons/BanIcon";
import { ChildIcon } from "../assets/icons/ChildIcon";
import { InformationIcon } from "../assets/icons/InformationIcon";
import { LocationIcon } from "../assets/icons/LocationIcon";
import { PersonIcon } from "../assets/icons/PersonIcon";
import TitleSection from "../components/asp/requests/TitleSection";
import { OnboardingRequest } from "../types/UserTypes";

const GET_ASP_ONBOARDING_REQUESTS = gql`
  query GetASPOnboardingRequests {
    getAllOnboardingRequests(status: "Pending", role: "ASP", number: 100) {
      id
      info {
        email
        organizationAddress
        organizationName
        organizationDesc
        role
        primaryContact {
          name
          email
          phone
        }
        active
      }
      dateSubmitted
    }
  }
`;

const getTitleSection = (): React.ReactElement => {
  return (
    <Flex flexDir="column" width="100%">
      <Flex width="100%" justifyContent="flex-end">
        <Button
          width="15%"
          height={{ base: "40px", lg: "45px" }}
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
          width="15%"
          height={{ base: "40px", lg: "45px" }}
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

const ApproveDenyModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): React.ReactElement => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent p="0.5%">
        <ModalHeader fontSize="md">Approve?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          If you click approve, this will allow this organization to sign onto
          the platform.
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Approve</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ASPCard = ({
  onboardingRequest,
}: {
  onboardingRequest: OnboardingRequest;
}): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card width="31%" padding="2%" mb="3%">
      <Flex flexDir="column">
        <Text variant="desktop-heading" color="primary.blue" mb="10px">
          {onboardingRequest?.info?.organizationName}
        </Text>
        <Text fontWeight="500" mb="20px">
          {onboardingRequest?.info?.email}
        </Text>
        <Flex flexDir="row">
          <PersonIcon />
          <Flex flexDir="column">
            <Text fontWeight="bold">Primary Contact</Text>
            <Text>{onboardingRequest?.info?.primaryContact?.name}</Text>
            <Text>{onboardingRequest?.info?.primaryContact?.email}</Text>
            <Text>{onboardingRequest?.info?.primaryContact?.phone}</Text>
          </Flex>
        </Flex>
        <Flex flexDir="row" mt="20px">
          <LocationIcon />
          <Flex flexDir="column">
            <Text fontWeight="bold">Address</Text>
            <Text>{onboardingRequest?.info?.organizationAddress}</Text>
          </Flex>
        </Flex>
        <Flex flexDir="row" mt="20px">
          <InformationIcon />
          <Flex flexDir="column">
            <Text fontWeight="bold">Description of Organization</Text>
            <Text>{onboardingRequest?.info?.organizationDesc}</Text>
          </Flex>
        </Flex>
        <Flex flexDir="row" mt="20px">
          <ChildIcon />
          <Flex flexDir="column">
            <Text fontWeight="bold">Number of Kids</Text>
            <Text>40</Text>
          </Flex>
        </Flex>
        <Flex flexDir="row" mt="20px">
          <BanIcon />
          <Flex flexDir="column">
            <Text fontWeight="bold">Dietary Restrictions</Text>
            <Text>Peanuts, Eggs</Text>
          </Flex>
        </Flex>
        <Flex flexDir="row" mt="20px" justifyContent="flex-end">
          <Button
            width="30%"
            mr="5%"
            color="text.red"
            bgColor="text.white"
            border="2px solid"
            borderColor="text.red"
            _hover={{
              bgColor: "gray.gray83",
            }}
            onClick={() => {
              onOpen();
            }}
          >
            Deny
          </Button>
          <Button
            width="30%"
            mr="5px"
            onClick={() => {
              onOpen();
            }}
          >
            <ApproveDenyModal isOpen={isOpen} onClose={onClose} />
            Approve
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

const ASPCardDisplay = ({
  onboardingRequests,
}: {
  onboardingRequests: OnboardingRequest[];
}): React.ReactElement => {
  return (
    <Flex
      flexDir="row"
      flexWrap="wrap"
      justifyContent="space-between"
      margin="3%"
    >
      {onboardingRequests
        ? onboardingRequests.map((request: OnboardingRequest) => (
            <ASPCard key={request?.id} onboardingRequest={request} />
          ))
        : null}
    </Flex>
  );
};

const OnboardingRequestsPage = (): React.ReactElement => {
  const {
    data: aspOnboardingData,
    loading: aspOnboardingLoading,
    error: aspOnboardingError,
  } = useQuery(GET_ASP_ONBOARDING_REQUESTS);

  if (aspOnboardingLoading) return <Spinner />;

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
      {aspOnboardingData ? (
        <ASPCardDisplay
          onboardingRequests={aspOnboardingData.getAllOnboardingRequests}
        />
      ) : null}
    </Flex>
  );
};

export default OnboardingRequestsPage;

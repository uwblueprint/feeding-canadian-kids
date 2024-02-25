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
        roleInfo {
          aspInfo {
            numKids
          }
        }
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

const GET_MEAL_DONOR_ONBOARDING_REQUESTS = gql`
  query GetMealDonorOnboardingRequests {
    getAllOnboardingRequests(status: "Pending", role: "Donor", number: 100) {
      id
      info {
        email
        organizationAddress
        organizationName
        organizationDesc
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

const ApproveDenyModal = ({
  isOpen,
  onClose,
  approve,
}: {
  isOpen: boolean;
  onClose: () => void;
  approve: boolean;
}): React.ReactElement => {
  const onApprove = () => {
    onClose();
  };

  const onDeny = () => {
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent p="0.5%">
        <ModalHeader fontSize="md">
          {approve ? "Approve?" : "Deny?"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {approve
            ? "If you click approve, this will allow this organization to sign onto the platform."
            : "If you click deny, this will deny this organization to sign onto the platform."}
        </ModalBody>
        <ModalFooter>
          {approve ? (
            <Button width="25%" onClick={onApprove}>
              Approve
            </Button>
          ) : (
            <Button
              width="25%"
              color="text.white"
              bgColor="text.red"
              _hover={{
                bgColor: "background.darkred",
              }}
              onClick={onDeny}
            >
              Deny
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ASPCard = ({
  onboardingRequest,
  isASP,
}: {
  onboardingRequest: OnboardingRequest;
  isASP: boolean;
}): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isApproved, setIsApproved] = React.useState(false);

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
        {isASP ? (
          <>
            <Flex flexDir="row" mt="20px">
              <ChildIcon />
              <Flex flexDir="column">
                <Text fontWeight="bold">Number of Kids</Text>
                <Text>
                  {onboardingRequest?.info?.roleInfo?.aspInfo?.numKids}
                </Text>
              </Flex>
            </Flex>
            <Flex flexDir="row" mt="20px">
              <BanIcon />
              <Flex flexDir="column">
                <Text fontWeight="bold">Dietary Restrictions</Text>
                <Text>TODO: ADD DIET HERE</Text>
              </Flex>
            </Flex>
          </>
        ) : null}
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
              setIsApproved(false);
              onOpen();
            }}
          >
            Deny
            <ApproveDenyModal
              isOpen={isOpen}
              onClose={onClose}
              approve={isApproved}
            />
          </Button>
          <Button
            width="30%"
            mr="5px"
            onClick={() => {
              setIsApproved(true);
              onOpen();
            }}
          >
            Approve
            <ApproveDenyModal
              isOpen={isOpen}
              onClose={onClose}
              approve={isApproved}
            />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

const ASPCardDisplay = ({
  onboardingRequests,
  isASP,
}: {
  onboardingRequests: OnboardingRequest[];
  isASP: boolean;
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
            <ASPCard
              key={request?.id}
              onboardingRequest={request}
              isASP={isASP}
            />
          ))
        : null}
    </Flex>
  );
};

const OnboardingRequestsPage = (): React.ReactElement => {
  const [isASP, setIsASP] = React.useState(true);

  const {
    data: OnboardingData,
    loading: OnboardingLoading,
    error: OnboardingError,
  } = useQuery(
    isASP ? GET_ASP_ONBOARDING_REQUESTS : GET_MEAL_DONOR_ONBOARDING_REQUESTS,
  );

  // if (OnboardingLoading) return <Spinner />;

  const getTitleSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" width="100%">
        <Flex width="100%" justifyContent="flex-end">
          <Button
            width="15%"
            height={{ base: "40px", lg: "45px" }}
            color={isASP ? "text.black" : "text.white"}
            bgColor={isASP ? "background.white" : "primary.blue"}
            borderRadius="6px 0 0 6px"
            border="1px solid"
            borderColor="text.black"
            _hover={{
              bgColor: isASP ? "gray.gray83" : "secondary.blue",
            }}
            onClick={() => {
              setIsASP(false);
            }}
          >
            Meal Donors
          </Button>
          <Button
            width="15%"
            height={{ base: "40px", lg: "45px" }}
            color={isASP ? "text.white" : "text.black"}
            bgColor={isASP ? "primary.blue" : "background.white"}
            borderRadius="0 6px 6px 0"
            border="1px solid"
            borderColor="text.black"
            _hover={{
              bgColor: isASP ? "secondary.blue" : "gray.gray83",
            }}
            onClick={() => {
              setIsASP(true);
            }}
          >
            After School Program
          </Button>
        </Flex>
        <TitleSection
          title="Onboarding Requests"
          description={
            isASP
              ? "These are After School Program onboarding requests"
              : "These are Meal Donor onboarding requests"
          }
        />
      </Flex>
    );
  };

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
      {OnboardingData ? (
        <ASPCardDisplay
          onboardingRequests={OnboardingData.getAllOnboardingRequests}
          isASP={isASP}
        />
      ) : null}
    </Flex>
  );
};

export default OnboardingRequestsPage;

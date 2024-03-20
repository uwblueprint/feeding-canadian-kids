import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { FiFilter } from "react-icons/fi";

import { BanIcon } from "../assets/icons/BanIcon";
import { ChildIcon } from "../assets/icons/ChildIcon";
import { InformationIcon } from "../assets/icons/InformationIcon";
import { LocationIcon } from "../assets/icons/LocationIcon";
import { PersonIcon } from "../assets/icons/PersonIcon";
import TitleSection from "../components/asp/requests/TitleSection";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { ONBOARDING_REQUESTS_PAGE } from "../constants/Routes";
import { OnboardingRequest } from "../types/UserTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import useIsWebView from "../utils/useIsWebView";

const GET_ASP_ONBOARDING_REQUESTS = gql`
  query GetASPOnboardingRequests($status: [String!]) {
    getAllOnboardingRequests(status: $status, role: "ASP", number: 100) {
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
      status
    }
  }
`;

const GET_MEAL_DONOR_ONBOARDING_REQUESTS = gql`
  query GetMealDonorOnboardingRequests($status: [String!]) {
    getAllOnboardingRequests(status: $status, role: "Donor", number: 100) {
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
      status
    }
  }
`;

enum OnboardingRequestStatuses {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

const ApproveDenyModal = ({
  isOpen,
  onClose,
  approve,
  onboardingRequest,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  approve: boolean;
  onboardingRequest: OnboardingRequest;
  refetch: () => void;
}): React.ReactElement => {
  const APPROVE_ONBOARDING_REQUEST = gql`
    mutation ApproveOnboardingRequest($id: ID!) {
      approveOnboardingRequest(id: $id) {
        onboardingRequest {
          id
        }
      }
    }
  `;

  const REJECT_ONBOARDING_REQUEST = gql`
    mutation RejectOnboardingRequest($id: ID!) {
      rejectOnboardingRequest(id: $id) {
        onboardingRequest {
          id
        }
      }
    }
  `;

  const toast = useToast();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [approveOnboardingRequest] = useMutation<{
    approveOnboardingRequest: { id: string };
  }>(APPROVE_ONBOARDING_REQUEST);
  const [rejectOnboardingRequest] = useMutation<{
    rejectOnboardingRequest: { id: string };
  }>(REJECT_ONBOARDING_REQUEST);

  const onApprove = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await approveOnboardingRequest({
        variables: {
          id: onboardingRequest?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Approve Successful!",
          status: "success",
          isClosable: true,
        });
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e);
      toast({
        title: "Failed to approve. Please try again.",
        status: "error",
        isClosable: true,
      });
    }

    refetch();
    onClose();
    await setIsSubmitLoading(false);
  };

  const onDeny = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await rejectOnboardingRequest({
        variables: {
          id: onboardingRequest?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Deny Successful!",
          status: "success",
          isClosable: true,
        });
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e);
      toast({
        title: "Failed to deny. Please try again.",
        status: "error",
        isClosable: true,
      });
    }

    refetch();
    onClose();
    await setIsSubmitLoading(false);
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
            <Button width="25%" onClick={onApprove} disabled={isSubmitLoading}>
              {isSubmitLoading ? <Spinner /> : "Approve"}
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
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? <Spinner /> : "Deny"}
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
  refetch,
}: {
  onboardingRequest: OnboardingRequest;
  isASP: boolean;
  refetch: () => void;
}): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isApproved, setIsApproved] = React.useState(false);

  const getStatusBadge = (status: OnboardingRequestStatuses) => {
    switch (status) {
      case OnboardingRequestStatuses.PENDING:
        return (
          <Badge colorScheme="yellow" borderRadius="8px">
            Pending
          </Badge>
        );
      case OnboardingRequestStatuses.APPROVED:
        return (
          <Badge colorScheme="green" borderRadius="8px">
            Approved
          </Badge>
        );
      case OnboardingRequestStatuses.REJECTED:
        return (
          <Badge colorScheme="red" borderRadius="8px">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      as="section"
      p="8%"
      mb="3%"
      boxShadow="lg"
      borderRadius="md"
      wordBreak="break-all"
    >
      <Grid templateColumns="auto 1fr" gap={6}>
        <Box gridColumn="span 2">
          <Text variant="desktop-heading" color="primary.blue" mb="2">
            <Flex align="center">
              {onboardingRequest?.info?.organizationName}
              <Spacer />
              {getStatusBadge(
                onboardingRequest?.status as OnboardingRequestStatuses,
              )}
            </Flex>
          </Text>
          <Text fontWeight="500" mb="4">
            {onboardingRequest?.info?.email}
          </Text>
        </Box>

        <PersonIcon />
        <Box>
          <Text fontWeight="bold">Primary Contact</Text>
          <Text>{onboardingRequest?.info?.primaryContact?.name}</Text>
          <Text>{onboardingRequest?.info?.primaryContact?.email}</Text>
          <Text>{onboardingRequest?.info?.primaryContact?.phone}</Text>
        </Box>

        <LocationIcon />
        <Box>
          <Text fontWeight="bold">Address</Text>
          <Text>{onboardingRequest?.info?.organizationAddress}</Text>
        </Box>

        <InformationIcon />
        <Box>
          <Text fontWeight="bold">Description of Organization</Text>
          <Text>{onboardingRequest?.info?.organizationDesc}</Text>
        </Box>

        {isASP && (
          <>
            <ChildIcon />
            <Box>
              <Text fontWeight="bold">Number of Kids</Text>
              <Text>{onboardingRequest?.info?.roleInfo?.aspInfo?.numKids}</Text>
            </Box>

            <BanIcon />
            <Box>
              <Text fontWeight="bold">Dietary Restrictions</Text>
              <Text>TODO: ADD DIET HERE</Text>
            </Box>
          </>
        )}
        {onboardingRequest?.status === OnboardingRequestStatuses.PENDING ? (
          <Box
            gridColumn="span 2"
            display="flex"
            justifyContent="flex-end"
            gap="3%"
          >
            <Button
              width="30%"
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
            </Button>
            <Button
              width="30%"
              onClick={() => {
                setIsApproved(true);
                onOpen();
              }}
            >
              Approve
            </Button>
          </Box>
        ) : null}
      </Grid>

      <ApproveDenyModal
        isOpen={isOpen}
        onClose={onClose}
        approve={isApproved}
        onboardingRequest={onboardingRequest}
        refetch={refetch}
      />
    </Box>
  );
};

const ASPCardDisplay = ({
  onboardingRequests,
  isASP,
  refetch,
}: {
  onboardingRequests: OnboardingRequest[];
  isASP: boolean;
  refetch: () => void;
}): React.ReactElement => {
  const isWebView = useIsWebView();

  return (
    <Flex
      width="90%"
      margin="0 5% 5%"
      display="grid"
      gridTemplateColumns={isWebView ? "repeat(3, 1fr)" : "repeat(1, 1fr)"}
      gridColumnGap="3%"
      gridRowGap={isWebView ? "30px" : "50px"}
    >
      {onboardingRequests
        ? onboardingRequests.map((request: OnboardingRequest) => (
            <ASPCard
              key={request?.id}
              onboardingRequest={request}
              isASP={isASP}
              refetch={refetch}
            />
          ))
        : null}
    </Flex>
  );
};

const OnboardingRequestsPage = (): React.ReactElement => {
  const [isASP, setIsASP] = React.useState(true);
  const [filter, setFilter] = React.useState<Array<OnboardingRequestStatuses>>([
    OnboardingRequestStatuses.PENDING,
  ]);

  const {
    data: OnboardingData,
    loading: OnboardingLoading,
    error: OnboardingError,
    refetch,
  } = useQuery(
    isASP ? GET_ASP_ONBOARDING_REQUESTS : GET_MEAL_DONOR_ONBOARDING_REQUESTS,
    {
      variables: {
        status: filter,
      },
    },
  );

  const isWebView = useIsWebView();

  const getTitleSection = (): React.ReactElement => (
    <Flex flexDir="column" width="100%">
      <Flex width="100%" justifyContent="space-between">
        <Menu>
          <MenuButton
            minWidth="150px"
            height={{ base: "40px", lg: "45px" }}
            padding="0 0 0 40px"
            borderRadius="3px"
            border="solid 1px #E2E8F0"
            boxShadow="lg"
            color="black"
            backgroundColor="white"
            _hover={{ backgroundColor: "gray.200" }}
          >
            <Flex gap="5px">
              <FiFilter />
              <Text>Filter</Text>
            </Flex>
          </MenuButton>
          <MenuList zIndex="2">
            <MenuOptionGroup
              type="checkbox"
              value={filter}
              onChange={(value) =>
                setFilter(value as Array<OnboardingRequestStatuses>)
              }
            >
              <MenuItemOption value={OnboardingRequestStatuses.PENDING}>
                Pending
              </MenuItemOption>
              <MenuItemOption value={OnboardingRequestStatuses.APPROVED}>
                Approved
              </MenuItemOption>
              <MenuItemOption value={OnboardingRequestStatuses.REJECTED}>
                Rejected
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Flex width="100%" justify="flex-end">
          <Button
            width="15%"
            minWidth={{ base: "80px", lg: "150px" }}
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
            {isWebView ? "Meal Donors" : "Donors"}
          </Button>
          <Button
            width="15%"
            minWidth={{ base: "80px", lg: "150px" }}
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
            ASPs
          </Button>
        </Flex>
      </Flex>
      <TitleSection
        title="Onboarding Requests"
        description={
          isASP
            ? "These are After School Program onboarding requests"
            : "These are Meal Donor onboarding requests"
        }
      />
      <Center>
        <Text fontSize="sm" fontWeight="500">
          Filtering By:
          {filter.includes(OnboardingRequestStatuses.PENDING) && (
            <Badge
              ml="1"
              fontSize="0.7em"
              colorScheme="yellow"
              borderRadius="8px"
            >
              Pending
            </Badge>
          )}
          {filter.includes(OnboardingRequestStatuses.APPROVED) && (
            <Badge
              ml="3"
              fontSize="0.7em"
              colorScheme="green"
              borderRadius="8px"
            >
              Approved
            </Badge>
          )}
          {filter.includes(OnboardingRequestStatuses.REJECTED) && (
            <Badge ml="3" fontSize="0.7em" colorScheme="red" borderRadius="8px">
              Rejected
            </Badge>
          )}
        </Text>
      </Center>
    </Flex>
  );

  return (
    <Flex
      flexDir="column"
      w={{ base: "100%" }}
      p={{ base: "14px", sm: "36px", lg: "48px" }}
      gap={{ base: "32px", lg: "45px" }}
      borderRadius="8px"
      bgColor="background.white"
      justifyContent="center"
      alignItems="center"
    >
      {getTitleSection()}
      {OnboardingLoading ? (
        <LoadingSpinner />
      ) : (
        OnboardingData && (
          <ASPCardDisplay
            onboardingRequests={OnboardingData.getAllOnboardingRequests}
            isASP={isASP}
            refetch={refetch}
          />
        )
      )}
    </Flex>
  );
};

export default OnboardingRequestsPage;

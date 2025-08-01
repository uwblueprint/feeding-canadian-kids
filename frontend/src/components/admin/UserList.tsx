import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import {
  Contact,
  GetAllUserVariables,
  GetAllUsersData,
  UserData,
} from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import ListView from "../common/ListView";

const GET_ALL_USERS = gql`
  query GetAllUsers(
    $limit: Int
    $offset: Int
    $role: String
    $name: String
    $email: String
  ) {
    getAllUsers(
      limit: $limit
      offset: $offset
      role: $role
      name: $name
      email: $email
    ) {
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
        initialOnsiteContacts {
          name
          email
          phone
        }
        active
        involvedMealRequests
        roleInfo {
          aspInfo {
            numKids
          }
        }
      }
    }
  }
`;

const ACTIVATE_USER = gql`
  mutation ActivateUserByID($id: String!, $requestorId: String!) {
    activateUserByID(id: $id, requestorId: $requestorId) {
      user {
        id
      }
    }
  }
`;

const DEACTIVATE_USER = gql`
  mutation DeactivateUserByID($id: String!, $requestorId: String!) {
    deactivateUserByID(id: $id, requestorId: $requestorId) {
      user {
        id
      }
    }
  }
`;

type UserListProps = { isASP: boolean; rowsPerPage?: number };

const ActivateDeactivateModal = ({
  isOpen,
  onClose,
  userId,
  isActive,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isActive: boolean;
  refetch: () => void;
}): React.ReactElement => {
  const toast = useToast();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [activateUserById] = useMutation<{
    activateUserById: { id: string; requestorId: string };
  }>(ACTIVATE_USER);
  const [deactivateUserById] = useMutation<{
    deactivateUserById: { id: string; requestorId: string };
  }>(DEACTIVATE_USER);
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const onActivate = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await activateUserById({
        variables: {
          id: userId,
          requestorId: authenticatedUser?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Activation Successful!",
          status: "success",
          isClosable: true,
        });
        refetch();
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      toast({
        title: "Failed to activate. Please try again.",
        status: "error",
        isClosable: true,
      });
    }

    onClose();
    await setIsSubmitLoading(false);
  };

  const onDeactivate = async () => {
    await setIsSubmitLoading(true);

    try {
      const response = await deactivateUserById({
        variables: {
          id: userId,
          requestorId: authenticatedUser?.id,
        },
      });

      if (response.data) {
        toast({
          title: "Deactivation Successful!",
          status: "success",
          isClosable: true,
        });
        refetch();
      }
    } catch (e: unknown) {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      toast({
        title: "Failed to deactivate. Please try again.",
        status: "error",
        isClosable: true,
      });
    }

    onClose();
    await setIsSubmitLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent p="0.5%">
        <ModalHeader fontSize="md">
          {isActive ? "Deactivate?" : "Activate?"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isActive
            ? "Deactivating the user means they will not be able to login and use the platform. Make sure to manually remove them from any meal requests and delete any meal requests they have made in the past."
            : "Activating the user means they will be able to login and use the platform."}
        </ModalBody>
        <ModalFooter>
          {isActive ? (
            <Button
              width="25%"
              color="text.white"
              bgColor="text.red"
              _hover={{
                bgColor: "background.darkred",
              }}
              onClick={() => {
                onDeactivate();
              }}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? <Spinner /> : "Deactivate"}
            </Button>
          ) : (
            <Button
              width="25%"
              onClick={() => {
                onActivate();
              }}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? <Spinner /> : "Activate"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UserList = ({ isASP, rowsPerPage = 10 }: UserListProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { setAuthenticatedUser } = useContext(AuthContext);
  const [userId, setUserId] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [shouldReloadUsers, setReloadUsers] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const handleViewDonations = (donorId: string) => {
    setRedirectTo(`/admin/meal_requests/donor/${donorId}`);
  };

  const handleViewRequests = (donorId: string) => {
    setRedirectTo(`/admin/meal_requests/asp/${donorId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [
    getUsers,
    { loading: getUsersLoading, error: getUsersError, data: getUsersData },
  ] = useLazyQuery<GetAllUsersData, GetAllUserVariables>(GET_ALL_USERS, {
    onCompleted: (results) => {
      setData({
        nodes: results.getAllUsers?.map(
          (
            userData: UserData,
            //   index: number,
          ): TABLE_LIBRARY_TYPES.TableNode => ({
            id: userData.id,
            name: userData.info?.organizationName,
            description: userData.info?.organizationDesc,
            address: userData.info?.organizationAddress,
            email: userData.info?.email,
            primary_contact: userData.info?.primaryContact,
            onsite_staff: userData.info?.initialOnsiteContacts,
            active: userData.info?.active,
            num_kids: userData.info?.roleInfo?.aspInfo?.numKids ?? 0,
            _hasContent: false,
            nodes: null,
            involvedMealRequests: userData.info?.involvedMealRequests ?? 0,
          }),
        ),
      });
    },
  });

  const COLUMNS = [
    {
      label: "Name of Organization",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.name}</Text>
      ),
    },
    {
      label: "Address",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.address}</Text>
      ),
    },
    {
      label: "Email",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.email}</Text>
      ),
    },
    {
      label: isASP ? "# Created Meal Requests" : "# Committed Meal Requests",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.involvedMealRequests}</Text>
      ),
    },
    {
      label: "",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">
          {item.active ? (
            <Tag size="sm" borderRadius="full" colorScheme="green">
              Activated
            </Tag>
          ) : (
            <Tag size="sm" borderRadius="full" colorScheme="red">
              Deactivated
            </Tag>
          )}
        </Text>
      ),
    },
    {
      label: "",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Flex
          cursor="pointer"
          justifyContent="flex-end"
          onClick={handleExpand(item)}
        >
          {ids.includes(item.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      ),
    },
  ];

  const ROW_OPTIONS = {
    renderAfterRow: (item: TABLE_LIBRARY_TYPES.TableNode) => (
      <Collapse className="animate" in={ids.includes(item.id)}>
        <Flex
          p="16px"
          borderBottom="1px solid"
          borderColor="gray.400"
          flexDir="column"
        >
          <Flex flexDir="row" width="100%">
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">Name</Text>
              <Text variant="mobile-caption-2" mb="12px">
                {item.name}
              </Text>
              <Text variant="mobile-button-bold">Description</Text>
              <Text variant="mobile-caption-2" mb="12px">
                {item.description}
              </Text>
              <Text variant="mobile-button-bold">Login Email</Text>
              <Text variant="mobile-caption-2" mb="12px">
                {item.email}
              </Text>
              <Text variant="mobile-button-bold">Address</Text>
              <Text variant="mobile-caption-2" mb="12px">
                {item.address}
              </Text>
              {isASP ? (
                <>
                  <Text variant="mobile-button-bold">Num Kids</Text>
                  <Text variant="mobile-caption-2" mb="12px">
                    {item.num_kids}
                  </Text>
                </>
              ) : null}
            </Box>
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">Primary Contact</Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact.name}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact.email}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact.phone}
              </Text>
            </Box>
            <Box flex={1} p="8px">
              <Text variant="mobile-button-bold">
                {isASP ? "Additional Onsite Staff" : "Meal Donor Contacts"}
              </Text>
              {item.onsite_staff.map((staff: Contact) => (
                <Box key={staff.email} mb="8px">
                  <Text variant="mobile-caption-2">{staff.name}</Text>
                  <Text variant="mobile-caption-2">{staff.email}</Text>
                  <Text variant="mobile-caption-2">{staff.phone}</Text>
                </Box>
              ))}
            </Box>
            <Flex alignItems="end">
              {item.active ? (
                <Button
                  width="100%"
                  color="text.red"
                  bgColor="text.white"
                  border="2px solid"
                  borderColor="text.red"
                  _hover={{
                    bgColor: "gray.gray83",
                  }}
                  onClick={() => {
                    setUserId(String(item.id));
                    setIsActive(true);
                    onOpen();
                  }}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  width="100%"
                  color="green"
                  bgColor="text.white"
                  border="2px solid"
                  borderColor="green"
                  _hover={{
                    bgColor: "gray.gray83",
                  }}
                  onClick={() => {
                    setUserId(String(item.id));
                    setIsActive(false);
                    onOpen();
                  }}
                >
                  Activate
                </Button>
              )}
            </Flex>
          </Flex>
          {isASP ? (
            <Box
              marginTop="auto"
              marginLeft="auto"
              cursor="pointer"
              textDecoration="underline"
              onClick={() => handleViewRequests(String(item.id))}
            >
              View their meal requests &rarr;
            </Box>
          ) : (
            <Box
              marginTop="auto"
              marginLeft="auto"
              cursor="pointer"
              textDecoration="underline"
              onClick={() => handleViewDonations(String(item.id))}
            >
              View their meal donations &rarr;
            </Box>
          )}
        </Flex>
      </Collapse>
    ),
  };

  function reloadUsers() {
    const searchVariables: GetAllUserVariables = {
      role: isASP ? "ASP" : "Donor",
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
      name: "",
      email: "",
    };

    // If it's an email, put the email as a search term, else the name
    if (searchTerm.indexOf("@") !== -1) {
      searchVariables.email = searchTerm;
    } else {
      searchVariables.name = searchTerm;
    }

    getUsers({
      variables: searchVariables,
      fetchPolicy: shouldReloadUsers ? "network-only" : "cache-first",
    });
  }

  useEffect(() => {
    reloadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isASP, rowsPerPage, currentPage]);

  useEffect(() => {
    if (shouldReloadUsers) {
      reloadUsers();
      setReloadUsers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReloadUsers]);

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  if (getUsersError) {
    logPossibleGraphQLError(getUsersError, setAuthenticatedUser);

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="200px"
      >
        <Text>Error while getting users!</Text>
      </Box>
    );
  }

  return (
    <Box mt="24px" width="80%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.600" />
        </InputLeftElement>
        <Input
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              reloadUsers();
            }
          }}
          paddingLeft="36px"
          placeholder={`Search for ${
            isASP ? "After School Program" : "Meal Donor"
          } by name or by email`}
        />
      </InputGroup>
      <ListView
        columns={COLUMNS}
        rowOptions={ROW_OPTIONS}
        data={data}
        loading={getUsersLoading}
        requestType={isASP ? "After School Programs" : "Meal Donors"}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ActivateDeactivateModal
        isOpen={isOpen}
        onClose={onClose}
        userId={userId}
        isActive={isActive}
        refetch={() => {
          setReloadUsers(true);
        }}
      />
    </Box>
  );
};

export default UserList;

import { gql, useLazyQuery } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Collapse, Flex, HStack, Tag, Text } from "@chakra-ui/react";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useEffect, useState } from "react";

import {
  Contact,
  GetAllUserVariables,
  GetAllUsersData,
  UserData,
} from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import ListView from "../common/ListView";

const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int, $offset: Int, $role: String) {
    getAllUsers(limit: $limit, offset: $offset, role: $role) {
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
      }
    }
  }
`;

type UserListProps = { isASP: boolean; rowsPerPage?: number };

const UserList = ({ isASP, rowsPerPage = 10 }: UserListProps) => {
  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const [data, setData] = useState<{
    nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [
    getUsers,
    { loading: getUsersLoading, error: getUsersError, data: getUsersData },
  ] = useLazyQuery<GetAllUsersData, GetAllUserVariables>(GET_ALL_USERS, {
    onCompleted: (results) => {
      const test = {
        nodes: results.getAllUsers?.map(
          (userData: UserData): TABLE_LIBRARY_TYPES.TableNode => ({
            id: userData.id,
            name: userData.info?.organizationName,
            address: userData.info?.organizationAddress,
            email: userData.info?.email,
            description: userData.info?.organizationDesc,
            primary_contact: userData.info?.primaryContact,
            onsite_staff: userData.info?.initialOnsiteContacts,
            active: userData.info?.active,
            _hasContent: false,
            nodes: null,
          }),
        ),
      };
      setData({
        nodes: results.getAllUsers?.map(
          (
            userData: UserData,
            //   index: number,
          ): TABLE_LIBRARY_TYPES.TableNode => ({
            id: userData.id,
            name: userData.info?.organizationName,
            address: userData.info?.organizationAddress,
            email: userData.info?.email,
            description: userData.info?.organizationDesc,
            primary_contact: userData.info?.primaryContact,
            onsite_staff: userData.info?.initialOnsiteContacts,
            active: userData.info?.active,
            _hasContent: false,
            nodes: null,
          }),
        ),
      });
    },
  });

  useEffect(() => {
    function reloadMealRequests() {
      getUsers({
        variables: {
          role: isASP ? "ASP" : "Donor",
          limit: rowsPerPage,
          offset: (currentPage - 1) * rowsPerPage,
        },
      });
    }

    reloadMealRequests();
  }, [isASP, rowsPerPage, currentPage]);

  const handleDelete = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    // eslint-disable-next-line no-console
    console.log("delete clicked for item", item.id);
  };

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
      label: "# of Donations Made",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">TODO</Text>
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
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => {
        if (!item.pending) {
          return (
            <Flex
              cursor="pointer"
              justifyContent="flex-end"
              onClick={handleExpand(item)}
            >
              {ids.includes(item.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          );
        }

        return (
          <HStack>
            <DeleteIcon
              onClick={handleDelete(item)}
              cursor="pointer"
              _hover={{ color: "primary.blue" }}
            />
          </HStack>
        );
      },
    },
  ];

  const ROW_OPTIONS = {
    renderAfterRow: (item: TABLE_LIBRARY_TYPES.TableNode) => (
      <Collapse className="animate" in={ids.includes(item.id)}>
        <Flex
          flexDir="row"
          p="16px"
          borderBottom="1px solid"
          borderColor="gray.400"
        >
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Description</Text>
            <Text variant="mobile-caption-2" mb="12px">
              {item.description}
            </Text>
          </Box>
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Primary Contact</Text>
            <Text variant="mobile-caption-2">{item.primary_contact.name}</Text>
            <Text variant="mobile-caption-2">{item.primary_contact.email}</Text>
            <Text variant="mobile-caption-2">{item.primary_contact.phone}</Text>
          </Box>
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Additional Onsite Staff</Text>
            {item.onsite_staff.map((staff: Contact) => (
              <Box key={staff.email} mb="8px">
                <Text variant="mobile-caption-2">{staff.name}</Text>
                <Text variant="mobile-caption-2">{staff.email}</Text>
                <Text variant="mobile-caption-2">{staff.phone}</Text>
              </Box>
            ))}
          </Box>
        </Flex>
      </Collapse>
    ),
  };

  if (getUsersError) {
    logPossibleGraphQLError(getUsersError);

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
      <ListView
        columns={COLUMNS}
        rowOptions={ROW_OPTIONS}
        data={data}
        loading={getUsersLoading}
        requestType={isASP ? "After School Programs" : "Meal Donors"}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
};

export default UserList;

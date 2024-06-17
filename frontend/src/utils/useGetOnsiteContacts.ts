import { gql, useQuery } from "@apollo/client";
import { UseToastOptions, useMediaQuery } from "@chakra-ui/react";
import { useContext, useState } from "react";

import { logPossibleGraphQLError } from "./GraphQLUtils";

import AuthContext from "../contexts/AuthContext";
import { OnsiteContact } from "../types/UserTypes";

const GET_ONSITE_CONTACTS = gql`
  query getOnsiteContacts($id: String!) {
    getOnsiteContactForUserById(userId: $id) {
      id
      name
      email
      phone
    }
  }
`;

const useGetOnsiteContacts = (
  toast: (options: UseToastOptions | undefined) => void,
  setOnsiteContacts: (contacts: OnsiteContact[]) => void,
  setLoading?: (status: boolean) => void,
) => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  useQuery(GET_ONSITE_CONTACTS, {
    variables: { id: authenticatedUser?.id },
    onCompleted: (data) => {
      if (data.getOnsiteContactForUserById) {
        // json parse/stringify creates a deep copy of the array of contacts
        // this prevents setOnsiteInfo from mutating the original state of userInfo.onsiteContacts
        setOnsiteContacts(
          JSON.parse(JSON.stringify(data.getOnsiteContactForUserById)),
        );
      }
      if (setLoading) {
        setLoading(false);
      }
    },
    onError: (e) => {
      logPossibleGraphQLError(e, setAuthenticatedUser);
      if (toast) {
        toast({
          title: "Sorry, something went wrong!",
          status: "error",
          isClosable: true,
        });
      }
    },
    defaultOptions: {
      fetchPolicy: "network-only",
    },
  });
};

export default useGetOnsiteContacts;

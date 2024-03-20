import { gql, useQuery } from "@apollo/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button as ChakraButton, VStack } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import LoadingSpinner from "../components/common/LoadingSpinner";
import NearbySchoolList, {
  YOUR_MATCHES_PER_PAGE_LIMIT,
} from "../components/donor/NearbySchoolList";
import { LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { ErrorMessage } from "../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";

type ButtonProps = { text: string; path: string };
const MAX_DISTANCE = 50;

const YourMatchesPage = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [userId, setUserId] = useState<string>(authenticatedUser?.id || "");

  // Query to get all ASPs near the donor
  const GET_ASPS = gql`
    query GetASPNearLocation(
      $offset: Int
      $limit: Int
    ) {
      getASPNearLocation(
        requestorId: "${userId}", 
        maxDistance: ${MAX_DISTANCE}, 
        offset: $offset
        limit: $limit) {
        id
        distance
        info {
          organizationName
          organizationAddress
          email
          organizationDesc
          role
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
          initialOnsiteContacts {
            name
            email
            phone
          }
        }
      }
    }
  `;

  const [offset, setOffset] = useState(0);

  const { data: aspsData, error: aspsError, loading: aspsLoading } = useQuery(
    GET_ASPS,
    {
      variables: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        limit: YOUR_MATCHES_PER_PAGE_LIMIT,
        offset,
      },
    },
  );

  // If user is not authenticated, redirect to login page
  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  // Print out the ASPs near the donor
  logPossibleGraphQLError(aspsError);

  if (aspsError) {
    return <ErrorMessage />;
  }

  return aspsLoading ? (
    <LoadingSpinner />
  ) : (
    <VStack>
      <NearbySchoolList
        schools={aspsData.getASPNearLocation}
        offset={offset}
        setOffset={setOffset}
      />
    </VStack>
  );
};

export default YourMatchesPage;

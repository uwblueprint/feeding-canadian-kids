import { gql, useQuery } from "@apollo/client";
import { Button as ChakraButton, Spinner, Text, Wrap } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NearbySchoolList from "../components/donor/NearbySchoolList";
import * as Routes from "../constants/Routes";
import { LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { ASPDistance } from "../types/UserTypes";
import { ErrorMessage } from "../utils/ErrorUtils";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";

type ButtonProps = { text: string; path: string };

const YourMatchesPage = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [userId, setUserId] = useState<string>(authenticatedUser?.id || "");

  // Query to get all ASPs near the donor
  const GET_ASPS = gql`
    query GetASPNearLocation {
      getASPNearLocation(requestorId: "${userId}", maxDistance: 50) {
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

  const { data: aspsData, error: aspsError, loading: aspsLoading } = useQuery(
    GET_ASPS,
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
    <NearbySchoolList schools={aspsData.getASPNearLocation} />
  );
};

export default YourMatchesPage;

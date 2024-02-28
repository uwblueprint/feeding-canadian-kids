import { gql, useQuery } from "@apollo/client";
import { Button as ChakraButton, Spinner, Text, Wrap } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import NearbySchoolList from "../components/donor/NearbySchoolList";
import * as Routes from "../constants/Routes";
import { LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { ASPDistance } from "../types/UserTypes";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const YourMatchesPage = (): React.ReactElement => {
  const tempSchoolInfo: ASPDistance[] = [
    {
      id: "1",
      info: {
        organizationName: "School 1",
        organizationAddress: "121 Main St, San Jose, CA 95112",
        email: "test@sdff.ca",
        organizationDesc: "This is a school",
        role: "ASP",
        roleInfo: {
          aspInfo: {
            numKids: 100,
          },
          donorInfo: null,
        },
        primaryContact: {
          name: "John Doe",
          email: "john@doe.com",
          phone: "123-456-7890",
        },
        initialOnsiteContacts: [
          {
            name: "Jane Doe",
            email: "jane@doe.com",
            phone: "123-456-7890",
          },
          {
            name: "John Doe",
            email: "john@doe.com",
            phone: "123-456-7890",
          },
        ],
      },
      distance: 1,
    },
    {
      id: "2",
      info: {
        organizationName: "School 2",
        organizationAddress: "122 Main St, San Jose, CA 95112",
        email: "iamanotherschool@school.ca",
        organizationDesc: "This is a school",
        role: "ASP",
        roleInfo: {
          aspInfo: {
            numKids: 100,
          },
          donorInfo: null,
        },
        primaryContact: {
          name: "John Doe",
          email: "john@doe.com",
          phone: "123-456-7890",
        },
        initialOnsiteContacts: [
          {
            name: "Jane Doe",
            email: "jane@doe.com",
            phone: "123-456-7890",
          },
          {
            name: "John Doe",
            email: "john@doe.com",
            phone: "123-456-7890",
          },
        ],
      },
      distance: 2,
    },
    {
      id: "3",
      info: {
        organizationName: "School 3",
        organizationAddress: "123 Main St, San Jose, CA 95112",
        email: "iamanotherschool@school.ca",
        organizationDesc: "This is a school",
        role: "ASP",
        roleInfo: {
          aspInfo: {
            numKids: 100,
          },
          donorInfo: null,
        },
        primaryContact: {
          name: "John Doe",
          email: "john@doe.com",
          phone: "123-456-7890",
        },
        initialOnsiteContacts: [
          {
            name: "Jane Doe",
            email: "jane@doe.com",
            phone: "123-456-7890",
          },
          {
            name: "John Doe",
            email: "john@doe.com",
            phone: "123-456-7890",
          },
        ],
      },
      distance: 3,
    },
    {
      id: "4",
      info: {
        organizationName: "School 4",
        organizationAddress: "124 Main St, San Jose, CA 95112",
        email: "iamanotherschool@school.ca",
        organizationDesc: "This is a school",
        role: "ASP",
        roleInfo: {
          aspInfo: {
            numKids: 100,
          },
          donorInfo: null,
        },
        primaryContact: {
          name: "John Doe",
          email: "john@doe.com",
          phone: "124-456-7890",
        },
        initialOnsiteContacts: [
          {
            name: "Jane Doe",
            email: "jane@doe.com",
            phone: "124-456-7890",
          },
          {
            name: "John Doe",
            email: "john@doe.com",
            phone: "124-456-7890",
          },
        ],
      },
      distance: 4,
    },
  ];

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
  console.log(aspsData);
  console.log("error: ", aspsError);
  console.log("user id: ", userId);

  return aspsLoading ? (
    <Spinner />
  ) : (
    <NearbySchoolList
      // schools={aspsData.getASPNearLocation}
      schools={tempSchoolInfo}
    />
  );
};

export default YourMatchesPage;

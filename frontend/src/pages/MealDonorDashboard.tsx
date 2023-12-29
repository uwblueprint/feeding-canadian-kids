import { Button as ChakraButton, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import NearbySchoolList from "../components/donor/NearbySchoolList";
import * as Routes from "../constants/Routes";
import { ASPDistance } from "../types/UserTypes";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const MealDonorDashboard = (): React.ReactElement => {
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
        onsiteContacts: [
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
        onsiteContacts: [
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
        onsiteContacts: [
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
  ];

  return (
    /* <div
      style={{
        textAlign: "center",
        paddingTop: "20px",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Wrap>
        <Text>Meal Donor Dashboard</Text>
      </Wrap>
      <div style={{ height: "2rem" }} />
    </div> */
    <NearbySchoolList schools={tempSchoolInfo} />
  );
};

export default MealDonorDashboard;

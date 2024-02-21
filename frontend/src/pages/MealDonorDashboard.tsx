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

const MealDonorDashboard = (): React.ReactElement => {
  return (
    <div
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
    </div>
  );
};

export default MealDonorDashboard;

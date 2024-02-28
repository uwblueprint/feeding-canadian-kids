import { Button as ChakraButton, Text, Wrap } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import * as Routes from "../constants/Routes";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const MealDonorDashboard = (): React.ReactElement => (
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
        <Text> Meal Donor Dashboard</Text>
        <Button text="Upcoming Donations" path={Routes.UPCOMING_PAGE}/>
      </Wrap>
      <div style={{ height: "2rem" }} />
    </div>
  );

export default MealDonorDashboard;

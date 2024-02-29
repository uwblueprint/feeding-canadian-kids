import { gql, useQuery } from "@apollo/client";
import { Button, Link, Spinner, Text, Wrap } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import * as Routes from "../constants/Routes";

type ButtonProps = { text: string; path: string };

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
    <Text>Meal Donor Dashboard</Text>
    <Wrap>
      <Link as={RouterLink} to={Routes.YOUR_MATCHES_PAGE}>
        <Button>Go to matches</Button>
      </Link>
    </Wrap>
    <div style={{ height: "2rem" }} />
  </div>
);

export default MealDonorDashboard;

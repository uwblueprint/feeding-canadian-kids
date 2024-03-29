import { Button, Link, Spinner, Text, Wrap } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import * as Routes from "../constants/Routes";

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

      <Link
        as={RouterLink}
        to={`${Routes.MEAL_DONOR_FORM_PAGE}?ids=65cc28ce55434ad75a3a6439,65cc28cd55434ad75a3a6437,65cc28ce55434ad75a3a6438`}
      >
        <Button>Meal Donation Form</Button>
      </Link>

      <Link as={RouterLink} to={Routes.MEAL_DONOR_CALENDAR_PAGE}>
        <Button>Go to meal donor calendar</Button>
      </Link>
    </Wrap>
    <div style={{ height: "2rem" }} />
  </div>
);

export default MealDonorDashboard;

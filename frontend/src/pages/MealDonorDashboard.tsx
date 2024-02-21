import { Button, Link } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import * as Routes from "../constants/Routes";

const MealDonorDashboard = (): React.ReactElement => {
  const wrapperStyles = {
    height: "100vh",
    backgroundImage: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <div style={wrapperStyles}>
      <Link as={RouterLink} to={Routes.MEAL_DONOR_CALENDAR_PAGE}>
        <Button>Go to meal donor calendar</Button>
      </Link>
    </div>
  );
}

export default MealDonorDashboard;

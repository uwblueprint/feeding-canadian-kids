import { Button, Link } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import * as Routes from "../constants/Routes";

const Default = (): React.ReactElement => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Link as={RouterLink} to={Routes.DASHBOARD_PAGE}>
        <Button>Go to dashboard</Button>
      </Link>
      <Link as={RouterLink} to={Routes.MEAL_DONOR_DASHBOARD_PAGE}>
        <Button>Go to meal donor dashboard</Button>
      </Link>
    </div>
  );
};

export default Default;

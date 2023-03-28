import { Button, Link } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../../assets/background.png";
import * as Routes from "../../constants/Routes";

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
      <h1>Feeding Canadian Kids</h1>
      <Button variant="outline">Hello!</Button>
      <Link as={RouterLink} to={Routes.DASHBOARD_PAGE}>
        Go to dashboard
      </Link>
    </div>
  );
};

export default Default;

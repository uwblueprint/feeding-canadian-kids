import { Button, Link } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import useIsMealDonor from "../utils/useIsMealDonor";

const Default = (): React.ReactElement => {
  const isMealDonor = useIsMealDonor();
  console.log("Is mela donor", isMealDonor);
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
      {isMealDonor ? (
        <Link as={RouterLink} to={Routes.MEAL_DONOR_DASHBOARD_PAGE}>
          <Button>Go to meal donor dashboard</Button>
        </Link>
      ) : (
        <Link as={RouterLink} to={Routes.ASP_DASHBOARD_PAGE}>
          <Button>Go to ASP dashboard</Button>
        </Link>
      )}
    </div>
  );
};

export default Default;

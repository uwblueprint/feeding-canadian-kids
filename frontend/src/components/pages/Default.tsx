import { Button, Link } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import * as Routes from "../../constants/Routes";

const Default = (): React.ReactElement => {
  return (
    <>
      <h1>Feeding Canadian Kids</h1>
      <Button variant="outline">Hello!</Button>
      <Link as={RouterLink} to={Routes.DASHBOARD_PAGE}>
        Go to dashboard
      </Link>
    </>
  );
};

export default Default;

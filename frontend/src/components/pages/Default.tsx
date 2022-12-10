import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import * as Routes from "../../constants/Routes";

const Default = (): React.ReactElement => {
  return (
    <>
      <h1>Feeding Canadian Kids</h1>
      <Button variant="outline">Hello!</Button>
      <Link to={Routes.DASHBOARD_PAGE}>Go to dashboard</Link>
    </>
  );
};

export default Default;

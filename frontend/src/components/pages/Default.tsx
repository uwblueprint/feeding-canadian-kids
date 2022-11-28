import React from "react";
import { Link } from "react-router-dom";

import * as Routes from "../../constants/Routes";

const Default = (): React.ReactElement => {
  return (
    <>
      <h1>Feeding Canadian Kids</h1>
      <Link to={Routes.DASHBOARD_PAGE}>Go to dashboard</Link>
    </>
  );
};

export default Default;

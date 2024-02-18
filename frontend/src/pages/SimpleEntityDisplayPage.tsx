import React from "react";

import MainPageButton from "../components/common/MainPageButton";
import SimpleEntityDisplayTableContainer from "../components/crud/SimpleEntityDisplayTableContainer";

const GetSimpleEntitiesPage = (): React.ReactElement => (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <SimpleEntityDisplayTableContainer />
    </div>
  );

export default GetSimpleEntitiesPage;

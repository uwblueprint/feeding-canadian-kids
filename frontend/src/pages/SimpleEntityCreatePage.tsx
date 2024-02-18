import React from "react";

import MainPageButton from "../components/common/MainPageButton";
import SimpleEntityCreateForm from "../components/crud/SimpleEntityCreateForm";

const SimpleEntityCreatePage = (): React.ReactElement => (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <SimpleEntityCreateForm />
    </div>
  );

export default SimpleEntityCreatePage;

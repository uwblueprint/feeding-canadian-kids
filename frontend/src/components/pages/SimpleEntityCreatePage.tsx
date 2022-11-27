import React from "react";

import MainPageButton from "../common/MainPageButton";
import SimpleEntityCreateForm from "../crud/SimpleEntityCreateForm";

const SimpleEntityCreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <SimpleEntityCreateForm />
    </div>
  );
};

export default SimpleEntityCreatePage;

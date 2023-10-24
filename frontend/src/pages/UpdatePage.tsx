import React from "react";

import MainPageButton from "../components/common/MainPageButton";
import UpdateForm from "../components/crud/UpdateForm";

const UpdatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <UpdateForm />
    </div>
  );
};

export default UpdatePage;

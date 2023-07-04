import { Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { HOME_PAGE } from "../../constants/Routes";

const MainPageButton = (): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={() => navigate(HOME_PAGE)}
        type="button"
        style={{ textAlign: "center" }}
      >
        Go Back
      </Button>
    </div>
  );
};

export default MainPageButton;

import React from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

const MainPageButton = (): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate(HOME_PAGE)}
        className="btn btn-primary"
        type="button"
        style={{ textAlign: "center" }}
      >
        Go Back
      </button>
    </div>
  );
};

export default MainPageButton;

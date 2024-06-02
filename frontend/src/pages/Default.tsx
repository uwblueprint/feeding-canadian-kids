import { Button, Link } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import { useGetDefaultPageForUser } from "../utils/useGetDefaultPageForUser";

// NOTE: This page is now unused. In the Routes.txt file, we hard code the HOME url to the default url for the user, so they should never get to this page. This is the dev home page.

const Default = (): React.ReactElement => {
  const navigate = useNavigate();
  const defaultPage = useGetDefaultPageForUser();
  useEffect(() => {
    navigate(defaultPage);
  });

  const wrapperStyles = {
    height: "100vh",
    backgroundImage: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <div style={wrapperStyles}>
      <Link as={RouterLink} to={defaultPage}>
        <Button>Go to your default page</Button>
      </Link>
    </div>
  );
};

export default Default;

import { Button as ChakraButton, Wrap } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import BackgroundImage from "../../assets/background.png";
import * as Routes from "../../constants/Routes";
import SampleContext from "../../contexts/SampleContext";
import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const TeamInfoDisplay = () => {
  const { teamName, numTerms, members, isActive } = useContext(SampleContext);
  return (
    <div>
      <h2>Team Info</h2>
      <div>Name: {teamName}</div>
      <div># terms: {numTerms}</div>
      <div>
        Members:{" "}
        {members.map(
          (name, i) => ` ${name}${i === members.length - 1 ? "" : ","}`,
        )}
      </div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
    </div>
  );
};

const Default = (): React.ReactElement => {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20px",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h1>Default Page</h1>
      <Wrap>
        <Logout />
        <Button
          text="Onboarding Requests"
          path={Routes.TEMP_ONBOARDING_REQUEST_PAGE}
        />
        <RefreshCredentials />
        <Button text="Hooks Demo" path={Routes.HOOKS_PAGE} />
      </Wrap>
      <div style={{ height: "2rem" }} />

      <TeamInfoDisplay />
    </div>
  );
};

export default Default;

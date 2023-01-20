import { gql, useMutation } from "@apollo/client";
import { Button, Input } from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

export const Join = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <h1>Join</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
};

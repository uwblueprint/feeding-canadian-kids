import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const REFRESH = gql`
  mutation Refresh {
    refresh {
      accessToken
    }
  }
`;

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [refresh] = useMutation<{ refresh: { accessToken: string } }>(REFRESH);

  const onRefreshClick = async () => {
    const success = await authAPIClient.refresh(refresh);
    if (!success) {
      setAuthenticatedUser(null);
    }
  };

  return <Button onClick={onRefreshClick}>Refresh Credentials</Button>;
};

export default RefreshCredentials;

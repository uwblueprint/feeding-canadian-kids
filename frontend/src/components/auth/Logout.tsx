import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const LOGOUT = gql`
  mutation Logout($userId: String!) {
    logout(userId: $userId) {
      success
    }
  }
`;

const Logout = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [logout] = useMutation<{ logout: { success: boolean } }>(LOGOUT);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(
      String(authenticatedUser?.id),
      logout,
    );
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <Button
      width={{ base: "90px", md: "120px" }}
      height={{ base: "40px", md: "50px" }}
      p="0"
      variant="desktop-button-bold"
      bgColor="background.grey"
      border="2px solid"
      borderColor="primary.green"
      color="primary.green"
      _hover={{
        color: "background.grey",
        bgColor: "primary.green",
      }}
      onClick={onLogOutClick}
    >
      Log Out
    </Button>
  );
};

export default Logout;

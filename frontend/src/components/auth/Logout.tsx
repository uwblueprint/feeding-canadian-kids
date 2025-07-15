import { gql, useMutation } from "@apollo/client";
import { Button, Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { LOGIN_PAGE } from "../../constants/Routes";
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

  const navigate = useNavigate();

  const [logout, { loading: logoutLoading }] = useMutation<{
    logout: { success: boolean };
  }>(LOGOUT);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(
      String(authenticatedUser?.id),
      logout,
    );
    if (success) {
      setAuthenticatedUser(null);
    }
    navigate(LOGIN_PAGE);
  };

  return (
    <Button
      width="190px"
      height="45px"
      variant="desktop-button-bold"
      color="primary.green"
      bgColor="background.white"
      border="1px solid"
      borderColor="primary.green"
      borderRadius="6px"
      _hover={{ color: "text.white", bgColor: "primary.green" }}
      onClick={onLogOutClick}
      isDisabled={logoutLoading}
    >
      {logoutLoading ? <Spinner /> : "Log Out"}
    </Button>
  );
};

export default Logout;

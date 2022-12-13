import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

import AuthContext from "../../contexts/AuthContext";

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      success
    }
  }
`;

const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const [resetPassword] = useMutation<{ resetPassword: { success: boolean } }>(
    RESET_PASSWORD,
  );

  const onResetPasswordClick = async () => {
    await resetPassword({ variables: { email: authenticatedUser?.email } });
  };

  return <Button onClick={onResetPasswordClick}>Reset Password</Button>;
};

export default ResetPassword;

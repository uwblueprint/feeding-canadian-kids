import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";

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

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onResetPasswordClick}
    >
      Reset Password
    </button>
  );
};

export default ResetPassword;

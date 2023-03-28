import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { googleLogout } from "@react-oauth/google";

import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser } from "../types/AuthTypes";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";

type LoginFunction = (
  options?:
    | MutationFunctionOptions<{ login: AuthenticatedUser }, OperationVariables>
    | undefined,
) => Promise<
  FetchResult<
    { login: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const login = async (
  email: string,
  password: string,
  loginFunction: LoginFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  const result = await loginFunction({ variables: { email, password } });
  user = result.data?.login ?? null;
  if (user) {
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
  }
  return user;
};

type LoginWithGoogleFunction = (
  options?:
    | MutationFunctionOptions<
        { loginWithGoogle: AuthenticatedUser },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    { loginWithGoogle: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const loginWithGoogle = async (
  idToken: string,
  loginFunction: LoginWithGoogleFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await loginFunction({
      variables: { idToken },
    });
    user = result.data?.loginWithGoogle ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to login");
  }
  return user;
};

type RegisterFunction = (
  options?:
    | MutationFunctionOptions<
        { register: AuthenticatedUser },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    { register: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  registerFunction: RegisterFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await registerFunction({
      variables: { firstName, lastName, email, password },
    });
    user = result.data?.register ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to sign up");
  }
  return user;
};

type LogoutFunction = (
  options?:
    | MutationFunctionOptions<
        {
          logout: { success: boolean };
        },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    {
      logout: { success: boolean };
    },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const logout = async (
  authenticatedUserId: string,
  logoutFunction: LogoutFunction,
): Promise<boolean> => {
  const result = await logoutFunction({
    variables: { userId: authenticatedUserId },
  });
  const success = result.data?.logout.success ?? false;
  if (success) {
    googleLogout();
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
  }
  return success;
};

type ResetPasswordFunction = (
  options?:
    | MutationFunctionOptions<
        {
          resetPassword: { success: boolean };
        },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    {
      resetPassword: { success: boolean };
    },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const resetPassword = async (
  authenticatedUserEmail: string,
  newPassword: string,
  resetPasswordFunction: ResetPasswordFunction,
): Promise<boolean> => {
  const result = await resetPasswordFunction({
    variables: { email: authenticatedUserEmail, password: newPassword },
  });
  const success = result.data?.resetPassword.success ?? false;
  return success;
};

type RefreshFunction = (
  options?:
    | MutationFunctionOptions<
        {
          refresh: { accessToken: string };
        },
        OperationVariables
      >
    | undefined,
) => Promise<
  FetchResult<
    {
      refresh: { accessToken: string };
    },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const refresh = async (refreshFunction: RefreshFunction): Promise<boolean> => {
  const result = await refreshFunction();
  let success = false;
  const token = result.data?.refresh?.accessToken;
  if (token) {
    success = true;
    setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
  }
  return success;
};

export default { login, logout, loginWithGoogle, register, refresh, resetPassword };

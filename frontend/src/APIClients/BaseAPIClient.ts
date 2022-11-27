import axios, { AxiosRequestConfig } from "axios";

import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import * as auth from "../utils/AuthUtils";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const baseAPIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

baseAPIClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // if access token in header has expired, do a refresh
  const authHeaderParts = config.headers.Authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    if (!auth.isUnexpiredToken(authHeaderParts[1])) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const accessToken = data.accessToken || data.access_token;
      setLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
        accessToken,
      );

      newConfig.headers.Authorization = accessToken;
    }
  }

  return newConfig;
});

export default baseAPIClient;

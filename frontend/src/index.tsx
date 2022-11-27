import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import { AuthenticatedUser } from "./types/AuthTypes";
import * as auth from "./utils/AuthUtils";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "./utils/LocalStorageUtils";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const REFRESH_MUTATION = `
  mutation Index_Refresh {
    refresh
  }
`;

const link = createUploadLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token: string | null = getLocalStorageObjProperty<
    NonNullable<AuthenticatedUser>,
    string
  >(AUTHENTICATED_USER_KEY, "accessToken");

  // refresh if token has expired
  if (!auth.isUnexpiredToken(token)) {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/graphql`,
      { query: REFRESH_MUTATION },
      { withCredentials: true },
    );

    const accessToken: string = data.data.refresh;
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      accessToken,
    );
    token = accessToken;
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

const root = document.getElementById("root");
if (root == null) {
  document.body.innerHTML = "Failed to load application.";
  throw Error("Missing root element");
}

createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </GoogleOAuthProvider>
    ;
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

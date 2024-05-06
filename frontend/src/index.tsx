import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createUploadLink } from "apollo-upload-client";
import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import defaultTheme from "./theme";
import { AuthenticatedUser } from "./types/UserTypes";
import * as auth from "./utils/AuthUtils";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "./utils/LocalStorageUtils";

const REFRESH_MUTATION = `
  mutation Index_Refresh {
    refresh {
      accessToken
    }
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
  if (auth.shouldRenewToken(token)) {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/graphql`,
      { query: REFRESH_MUTATION },
      { withCredentials: true },
    );

    const accessToken = data.data?.refresh?.accessToken;
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

// Removes the __typename field from all variables before sending them to the server.
const removeTypenameLink = removeTypenameFromVariables();

const apolloClient = new ApolloClient({
  link: removeTypenameLink.concat(authLink).concat(link),
  cache: new InMemoryCache({
    typePolicies: {
      MealRequestResponse: {
        fields: {
          donationInfo: {
            merge(existing, incoming) {
              // Custom merge logic
              return incoming;
            }
          }
        }
      }
    }
  }),
});

const root = document.getElementById("root");
if (root == null) {
  document.body.innerHTML = "Failed to load application.";
  throw Error("Missing root element");
}

// Providers for library-specific state like Apollo and OAuth are here.
// For app-specific providers like contexts, see App.tsx.
createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}>
      <ApolloProvider client={apolloClient}>
        <ChakraProvider theme={defaultTheme}>
          <App />
        </ChakraProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// returns true if string is a valid email
import { ApolloError } from "@apollo/client";

import { AuthenticatedUser } from "../types/UserTypes";

export const logPossibleGraphQLError = (
  graphqlError: ApolloError | undefined | unknown,
  setAuthenticatedUser: (_authenticatedUser: AuthenticatedUser) => void,
) => {
  if (graphqlError === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (graphqlError?.message.indexOf("not authorized") !== -1) {
    setAuthenticatedUser(null);
  }

  // eslint-disable-next-line no-console
  console.log("GraphQL request failed!", graphqlError);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(graphqlError, null, 2));
};

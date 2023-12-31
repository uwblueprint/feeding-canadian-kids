// returns true if string is a valid email
import { ApolloError } from "@apollo/client";

export const logPossibleGraphQLError = (
  graphqlError: ApolloError | undefined,
) => {
  if (graphqlError === undefined) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("GraphQL request failed!", graphqlError);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(graphqlError, null, 2));
};

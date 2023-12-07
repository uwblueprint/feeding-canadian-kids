// returns true if string is a valid email
import { ApolloError } from "@apollo/client";

export const logGraphQLError = (graphqlError: ApolloError) => {
  // eslint-disable-next-line no-console
  console.log("GraphQL request failed!", graphqlError);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(graphqlError, null, 2));
};

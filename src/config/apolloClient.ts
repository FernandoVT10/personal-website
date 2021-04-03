import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  uri: process.env.GRAPHQL_URI,
  cache: new InMemoryCache()
});

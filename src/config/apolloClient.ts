import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  cache: new InMemoryCache()
});

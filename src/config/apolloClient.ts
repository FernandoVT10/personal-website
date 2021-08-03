import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
  const token = process.browser ? localStorage.getItem("token") : undefined;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

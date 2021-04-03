import express from "express";
import next from "next";

import { ApolloServer } from "apollo-server-express";

import resolvers from "./resolvers";
import typeDefs from "./schema";

const dev = process.env.NODE_ENV !== "production";

const app = express();

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const server = new ApolloServer({ typeDefs, resolvers });

export default async function startServer() {
  await nextApp.prepare();

  await server.start();

  server.applyMiddleware({ app });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  await new Promise(resolve => app.listen(3000, () => resolve(true)));

  console.log(`🚀  Server ready at http://localhost:3000${server.graphqlPath}`);
}

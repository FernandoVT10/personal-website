import express from "express";
import next from "next";

import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import validateJWTToken from "./utils/validateJWTToken";

const PORT = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== "production";

const app = express();

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const server = new ApolloServer({
  schema,
  uploads: false,
  context: async ({ req }) => {
    const authorizationHeader = req.headers.authorization || "";
    const token = authorizationHeader.replace("Bearer ", "");

    const isValid = await validateJWTToken(token);

    return { loggedIn: isValid }
  }
});

app.use(graphqlUploadExpress({
  maxFileSize: 10000000,
  maxFiles: 20
}));

export default async function startServer() {
  await nextApp.prepare();

  await server.start();

  server.applyMiddleware({ app });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  await new Promise(resolve => app.listen(PORT, () => resolve(true)));

  console.log(`🚀  Server listening on the port ${PORT}`);
}

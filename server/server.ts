import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import db from "./config/connection";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import { authenticateToken } from "./utils/auth.js";
import cors from "cors";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    cors({
      origin: "*",
      credentials: false,
    })
  );

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authenticateToken,
    })
  );

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

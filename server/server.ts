// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// dotenv.config();

// const PORT = parseInt(process.env.PORT || "4000", 10);
// const app = express();

// app.use(cors());
// app.use(express.json());

// async function startServer() {
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: authMiddleware,
//     plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
//   });

//   await server.start();
//   server.applyMiddleware({ app: app as any });

//   try {
//     await mongoose.connect(process.env.MONGODB_URI || "", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     } as mongoose.ConnectOptions);
//     console.log("✅ Connected to MongoDB");

//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(
//         `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
//       );
//     });
//   } catch (err) {
//     console.error("❌ Failed to connect to MongoDB", err);
//   }
// }

// startServer();
import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import db from "./config/connection";
import { ApolloServer } from "@apollo/server"; // Note: Import from @apollo/server-express
import { expressMiddleware } from "@apollo/server/express4";
// import { typeDefs, resolvers } from './schemas/index.js';
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
// import { authMiddleware } from "./utils/auth";
import { authenticateToken } from "./utils/auth.js";

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
    "/graphql",
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // if (process.env.NODE_ENV === 'production') {
  //   app.use(express.static(path.join(__dirname, '../client/dist')));

  //   app.get('*', (_req: Request, res: Response) => {
  //     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  //   });
  // }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

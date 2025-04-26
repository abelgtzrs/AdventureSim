import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Extend the Request interface to include apolloContext
declare global {
  namespace Express {
    interface Request {
      apolloContext?: BaseContext;
    }
  }
}
import { ApolloServer, BaseContext } from "@apollo/server";
import { express as cookiesExpress } from "cookies";
import mongoose from "mongoose";
import resolvers from "./schemas/resolvers";
import typeDefs from "./schemas/typeDefs";
import { authMiddleware } from "./utils/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const PORT = process.env.PORT || 4000;

  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<BaseContext> => {
        const context = authMiddleware({ req });
        return { ...context };
      },
    })
  );

  mongoose.connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
}

function expressMiddleware(
  server: ApolloServer<BaseContext>,
  { context }: { context: ({ req }: { req: Request }) => Promise<BaseContext> }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ctx = await context({ req });
      req["apolloContext"] = ctx; // Attach the context to the request object
      next();
    } catch (err) {
      console.error("Error in expressMiddleware:", err);
      res.status(500).send("Internal Server Error");
    }
  };
}

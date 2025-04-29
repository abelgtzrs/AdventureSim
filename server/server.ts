import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import adventureSessionRoutes from "./Routes/AdventureSessionsRoutes";
import { ApolloServer, BaseContext } from "@apollo/server";
import mongoose from "mongoose";
import resolvers from "./schemas/resolvers";
import typeDefs from "./schemas/typeDefs";
import { authMiddleware } from "./utils/auth";
// Extend the Request interface to include apolloContext
declare global {
  namespace Express {
    interface Request {
      apolloContext?: BaseContext;
    }
  }
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

// Use the AdventureSession routes
app.use("/api/adventure-sessions", adventureSessionRoutes);

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
  
  dotenv.config();

  console.log("MONGODB_URI:", process.env.MONGODB_URI); // Log the MONGODB_URI value
  
  mongoose.connect(process.env.MONGO_URI || "", {
    dbName: "adventure_sim",
  });
  
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });

}

startServer().catch((err) => {
  console.error("Error starting the server:", err);
});

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



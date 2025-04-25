import express from "express";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import { authMiddleware } from "./utils/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  mongoose.connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

startServer();

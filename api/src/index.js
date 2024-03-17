import express from "express";
import { ApolloServer } from "apollo-server-express";
import connectToDatabase from "./db.js";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";


async function startServer() {
  //  // Connect to the database
  await connectToDatabase();

  // Create an Express app
  const app = express();

  // Create an Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  //start the server
  await server.start();

  // Apply the Apollo middleware to the Express app
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

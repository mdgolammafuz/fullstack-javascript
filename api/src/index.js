import express from "express";
import { ApolloServer } from "apollo-server-express";
import connectToDatabase from "./db.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers/index.js";
import models from "./models/index.js";
import jwt from "jsonwebtoken";

async function startServer() {
  // Connect to the database
  await connectToDatabase();

  // Create an Express app
  const app = express();

  // get the user info from a JWT
  const getUser = (token) => {
    if (token) {
      try {
        // return the user information from the token
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        // if there's a problem with the token, throw an error
        throw new Error("Session invalid");
      }
    }
  };

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization;
      // try to retrieve a user with the token
      const user = getUser(token);
      // for now, let's log the user to the console:
      //console.log("User:", user);
      // add the db models and the user to the context
      return { models, user };
    },
  });

  //start the server
  await server.start();

  // Apply the Apollo middleware to the Express app
  server.applyMiddleware({ app, path: "/api" });

  // Start the Express server
  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

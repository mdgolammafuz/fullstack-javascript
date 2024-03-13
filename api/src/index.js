import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { graphql } from "graphql";

// Construct a schema, using GraphQL schema language
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const app = express();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);

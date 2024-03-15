import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { graphql } from "graphql";

let notes = [
  { id: "1", content: "This is the first note", author: "Mr. X" },
  { id: "2", content: "This is another note", author: "Mr. Y" },
  { id: "3", content: "Oh hey look, this is the third one!", author: "Mr. Z" },
];

// Construct a schema, using GraphQL schema language
const typeDefs = `#graphql
  type Note {
        id: ID!
        content: String!
        author: String!
  }
   type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
}
  type Mutation {
    newNote(content: String!): Note!
}
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    notes: () => notes,
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: "Md. Golam Mafuz",
      };
      notes.push(noteValue);
      return noteValue;
    },
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

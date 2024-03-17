import models from "./models/index.js";

// Provide resolver functions for our schema fields
export const resolvers = {
  Query: {
    hello: () => "Hello world!",
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    },
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Md Golam Mafuz",
      });
    },
  },
};

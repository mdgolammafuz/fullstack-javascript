import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import "dotenv/config";
import gravatar from "../util/gravatar.js";

async function newNote(parent, args, { models }) {
  return await models.Note.create({
    content: args.content,
    author: "Md Golam Mafuz",
  });
}

async function deleteNote(parent, { id }, { models }) {
  try {
    await models.Note.findOneAndRemove({ _id: id });
    return true;
  } catch (err) {
    return false;
  }
}

async function updateNote(parent, { content, id }, { models }) {
  try {
    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );
  } catch (err) {
    throw new Error("Error updating note");
  }
}

async function signUp(parent, { username, email, password }, { models }) {
  // normalize email address
  email = email.trim().toLowerCase();
  // hash the password
  const hashed = await bcrypt.hash(password, 10);
  // create the gravatar url
  const avatar = gravatar(email);
  try {
    const user = await models.User.create({
      username,
      email,
      avatar,
      password: hashed,
    });

    // create and return the json web token
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(`${user} signed up`);
  } catch (err) {
    // if there's a problem creating the account, throw an error
    throw new Error("Error creating account");
  }
}

async function signIn(parent, { username, email, password }, { models }) {
  if (email) {
    // normalize email address
    email = email.trim().toLowerCase();
  }

  const user = await models.User.findOne({
    $or: [{ email }, { username }],
  });

  // if no user is found, throw an authentication error
  if (!user) {
    throw new AuthenticationError("Error signing in");
  }

  // if the passwords don't match, throw an authentication error
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthenticationError("Error signing in");
  }

  // create and return the json web token
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log(`${user} signed in`);
}

const Mutation = { newNote, deleteNote, updateNote, signUp, signIn };
export default Mutation;

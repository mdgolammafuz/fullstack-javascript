import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import "dotenv/config";
import gravatar from "../util/gravatar.js";
import mongoose from "mongoose";

async function newNote(parent, args, { models, user }) {
  if (!user) {
    throw new AuthenticationError("You must be signed in to create a note");
  }

  return await models.Note.create({
    content: args.content,
    author: new mongoose.Types.ObjectId(user.id),
    favoriteCount: 0,
  });
}

async function deleteNote(parent, { id }, { models }) {
  // if not a user, throw an Authentication Error
  if (!user) {
    throw new AuthenticationError("You must be signed in to delete a note");
  }

  // find the note
  const note = await models.Note.findById(id);
  // if the note owner and current user don't match, throw a forbidden error
  if (note && String(note.author) !== user.id) {
    throw new ForbiddenError("You don't have permissions to delete the note");
  }

  try {
    // if everything checks out, remove the note
    await note.remove();
    return true;
  } catch (err) {
    // if there's an error along the way, return false
    return false;
  }
}

async function updateNote(parent, { content, id }, { models }) {
  // if not a user, throw an Authentication Error
  if (!user) {
    throw new AuthenticationError("You must be signed in to update a note");
  }

  // find the note
  const note = await models.Note.findById(id);
  // if the note owner and current user don't match, throw a forbidden error
  if (note && String(note.author) !== user.id) {
    throw new ForbiddenError("You don't have permissions to update the note");
  }

  // Update the note in the db and return the updated note
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
}

async function toggleFavorite(parent, { id }, { models, user }) {
  // if no user context is passed, throw auth error
  if (!user) {
    throw new AuthenticationError();
  }

  // check to see if the user has already favorited the note
  let noteCheck = await models.Note.findById(id);
  const hasUser = noteCheck.favoritedBy.indexOf(user.id);

  // if the user exists in the list
  // pull them from the list and reduce the favoriteCount by 1
  if (hasUser >= 0) {
    return await models.Note.findByIdAndUpdate(
      id,
      {
        $pull: {
          favoritedBy: new mongoose.Types.ObjectId(user.id),
        },
        $inc: {
          favoriteCount: -1,
        },
      },
      {
        // Set new to true to return the updated doc
        new: true,
      }
    );
  } else {
    // if the user doesn't exists in the list
    // add them to the list and increment the favoriteCount by 1
    return await models.Note.findByIdAndUpdate(
      id,
      {
        $push: {
          favoritedBy: new mongoose.Types.ObjectId(user.id),
        },
        $inc: {
          favoriteCount: 1,
        },
      },
      {
        new: true,
      }
    );
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
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
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
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

const Mutation = {
  newNote,
  deleteNote,
  updateNote,
  toggleFavorite,
  signUp,
  signIn,
};
export default Mutation;

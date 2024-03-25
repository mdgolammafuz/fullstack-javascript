// Require the mongoose library
import { Schema, model } from "mongoose";
import mongoose from "mongoose";

// Define the note's database schema
const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // reference the author's object ID
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true,
  }
);

// Define the 'Note' model with the schema
const Note = model("Note", noteSchema);

// Export the module
export default Note;

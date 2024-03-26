// Resolve the author info for a note when requested
async function author(note, args, { models }) {
  return await models.User.findById(note.author);
}

// Resolved the favoritedBy info for a note when requested
async function favoritedBy(note, args, { models }) {
  return await models.User.find({ _id: { $in: note.favoritedBy } });
}

const Note = { author, favoritedBy };
export default Note;

// Resolve the list of notes for a user when requested
async function notes(user, args, { models }) {
  return await models.Note.find({ author: user._id }).sort({ _id: -1 });
}

// Resolve the list of favorites for a user when requested
async function favorites(user, args, { models }) {
  return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
}

const User = { notes, favorites };
export default User;

async function newNote(parent, args, { models }) {
  return await models.Note.create({
    content: args.content,
    author: "Adam Scott",
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

const Mutation = { newNote, deleteNote, updateNote };
export default Mutation;

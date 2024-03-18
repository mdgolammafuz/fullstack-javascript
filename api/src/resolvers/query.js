async function notes(parent, args, { models }) {
  return await models.Note.find();
}
async function note(parent, args, { models }) {
  return await models.Note.findById(args.id);
}

const Query = { notes, note };
export default Query

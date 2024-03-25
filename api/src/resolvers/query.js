async function notes(parent, args, { models }) {
  return await models.Note.find();
}

async function note(parent, args, { models }) {
  return await models.Note.findById(args.id);
}

async function user(parent, args, { models }) {
  return await models.User.findOne({ username: args.username });
}

async function users(parent, args, { models }) {
  return await models.User.find({});
}

async function me(parent, args, { models, user }) {
  return await models.User.findById(user.id);
}

const Query = { notes, note, user, users, me };
export default Query;

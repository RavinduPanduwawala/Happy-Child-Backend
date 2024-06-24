const db = require('../helpers/database');

const { Goal } = db;

module.exports = {
  create,
  get,
  update,
  getById,
  deleteById
};

async function create(goal) {
  const new_goal = Goal(goal);
  let response = {};
  try {
    response = await new_goal.save();
  } catch (err) {
    console.log(err);
    response.error = 'There was an issue while creating the goal.';
  }
  return response;
}

async function get(query) {
  try {
    return await Goal.find(query);
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteById(id) {
  try {
    await Goal.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
}

async function update(goal, id) {
  try {
    const foundGoal = await Goal.findOne({ _id: id });
    Object.assign(foundGoal, goal);

    return foundGoal.save();
  } catch (err) {
    throw new Error(err);
  }
}

async function getById(id) {
  try {
    return await Goal.findById(id);
  } catch (err) {
    throw new Error(err);
  }
}

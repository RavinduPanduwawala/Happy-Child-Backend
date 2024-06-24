const db = require('../helpers/database');

const { Assessment } = db;

module.exports = {
  create,
  getAll,
  update,
  getById,
  deleteById,
};

async function deleteById(id) {
  try {
    await Assessment.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
}

async function create(store) {
  try {
    const newAssessment = Assessment(store);

    return await newAssessment.save();
  } catch (err) {
    throw new Error(err);
  }
}

async function getAll() {
  try {
    return await Assessment.find({});
  } catch (err) {
    throw new Error(err);
  }
}

async function update(notice, id) {
  try {
    const foundAssessment = await Assessment.findById(id);
    Object.assign(foundAssessment, notice);

    return foundAssessment.save();
  } catch (err) {
    throw new Error(err);
  }
}

async function getById(id) {
  try {
    return await Assessment.findById(id);
  } catch (err) {
    throw new Error(err);
  }
}

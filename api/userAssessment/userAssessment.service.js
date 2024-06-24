const db = require('../helpers/database');

const { UserAssessment } = db;

module.exports = {
  create,
  getAll,
  update,
  getById,
  deleteById,
  getByUserId,
  get,
};

async function deleteById(id) {
  try {
    await UserAssessment.deleteOne({ _id: id });
  } catch (err) {
    throw new Error(err);
  }
}

async function create(store) {
  console.log('storeeee', store)

  try {
    const newUserAssessment = UserAssessment(store);

    return await newUserAssessment.save();
  } catch (err) {
    throw new Error(err);
  }
}

async function getAll() {
  try {
    return await UserAssessment.find({});
  } catch (err) {
    throw new Error(err);
  }
}

async function get(query) {
  try {
    return await UserAssessment.find(query).populate('userId');
  } catch (err) {
    throw new Error(err);
  }
}

async function getByUserId(query) {
  try {
    return await UserAssessment.find(query).populate('userId');
  } catch (err) {
    console.error("Error fetching assessments:", err);
    throw new Error(err);
  }
}

async function update(notice, id) {
  try {
    const foundUserAssessment = await UserAssessment.findById(id);

    if (!foundUserAssessment) {
      throw new Error('Assessment not found');
    }

    Object.assign(foundUserAssessment, notice);
    return foundUserAssessment.save();
  } catch (err) {
    throw new Error(err);
  }
}


async function getById(id) {
  try {
    return await UserAssessment.findById(id);
  } catch (err) {
    throw new Error(err);
  }
}

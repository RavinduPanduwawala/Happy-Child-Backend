/* eslint-disable global-require */
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://ravindupanduwawala321:fv8k0u9Lr1WjRUVA@cluster0.e0btmwk.mongodb.net/',
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('mongoDB connected...'));
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../user/user.model'),
  Assessment: require('../assessment/assessment.model'),
  UserAssessment: require('../userAssessment/userAssessment.model'),
  Goal: require('../goal/goal.model'),
};

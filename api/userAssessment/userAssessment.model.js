const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const UserAssessmentSchema = new Schema(
  {
    userId: {
      required: true,
      type: ObjectId,
      ref: 'User',
    },
    assessment: {
      type: Object,
      required: true,
    },
    calculatedMarks: {
      type: Object,
      required: false,
    },
    goal: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('UserAssessment', UserAssessmentSchema);

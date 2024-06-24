const mongoose = require('mongoose');

const { Schema } = mongoose;

const AssessmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: Array,
    },
    grade: {
      type: String,
    },
    game: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Assessment', AssessmentSchema);

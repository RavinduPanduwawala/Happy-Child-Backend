const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const GoalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    grade: {
      type: String,
    },
    level: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Goal', GoalSchema);

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    birthday: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ['ADMIN', 'CREATOR', 'TEACHER', 'STUDENT'],
    },
    grade: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);

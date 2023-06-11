const { Schema, model } = require("mongoose");

const userSchema = Schema({
  email: {
    type: String,
    required: [true, "DB: Field email is required"],
  },
  password: {
    type: String,
    required: [true, "DB: Field password is required"],
  },
  name: {
    type: String,
    default: "Sandra Bullock",
  },
  token: {
    type: String,
    default: null,
  },
  roles: [
    {
      type: String,
      ref: "roles",
    },
  ],
});

module.exports = model("users", userSchema);

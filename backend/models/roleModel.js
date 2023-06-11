const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  value: {
    type: String,
    required: true,
    default: "USER",
  },
});

module.exports = model("roles", roleSchema);

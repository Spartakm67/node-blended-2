const { Schema, model } = require("mongoose");

const alcoholsSchema = Schema({
  title: { type: String, required: [true, "DB: Field title is required"] },
  value: { type: Number, required: [true, "DB: Field value is required"] },
  rating: { type: Number, default: 0.0 },
  adult: { type: Boolean, default: true },
});

module.exports = model("alcohols", alcoholsSchema);

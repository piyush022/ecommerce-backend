const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adminSchema = schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("admin", adminSchema);

module.exports = model;

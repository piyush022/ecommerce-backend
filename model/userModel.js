const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    approved: { type: Boolean, default: false },
    wishlist: [mongoose.Schema.Types.ObjectId],
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("users", userSchema);

module.exports = model;

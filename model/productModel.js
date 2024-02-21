const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("Product", productSchema);

module.exports = model;

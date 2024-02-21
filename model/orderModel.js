const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const model = mongoose.model("Order", orderSchema);

module.exports = model;

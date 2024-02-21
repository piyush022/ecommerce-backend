const orderModel = require("../model/orderModel");

async function createOrder(req, res) {
  const { user, products, totalPrice, paymentMethod, paymentId, status } =
    req.body;

  try {
    const newOrder = new orderModel({
      user,
      products,
      totalPrice,
      paymentMethod,
      paymentId,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, msg: "order created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createOrder,
};

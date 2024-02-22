const express = require("express");
const { createOrder } = require("../controller/ordercontroller");

const router = express.Router();

router.post("/api/postOrder", createOrder); //for creating a order

module.exports = router;

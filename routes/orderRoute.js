const express = require("express");
const { createOrder } = require("../controller/ordercontroller");

const router = express.Router();

router.post("/api/postOrder", createOrder); //for inserting a order

module.exports = router;

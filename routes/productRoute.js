const express = require("express");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductByLocation,
} = require("../controller/productController");

const router = express.Router();

router.post("/api/postProduct", createProduct); //for inserting a product record

router.get("/api/getAllProducts", getProducts); //for getting all products

router.post("/api/getProductById", getProduct); //for getting product By Id

router.post("/api/getProductByLocation", getProductByLocation); //get products By USER LOCATION 10 KM RADIUS

router.put("/api/updateProduct", updateProduct); //for updating a product

router.post("/api/deleteProduct", deleteProduct); //for deleting a product

module.exports = router;

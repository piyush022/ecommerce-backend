const express = require("express");
const {
  postUser,
  getUser,
  putUser,
  deleteUser,
  findUser,
  getWishlist,
  inserToWishlist,
} = require("../controller/userController");

const router = express.Router();

router.post("/api/postUser", postUser); //for inserting a user record

router.get("/api/getAllUsers", getUser); //for getting all users

router.post("/api/getUserWishlist", getWishlist); //for getting wishlist of user USING AGGREGTE USER,PRODUCT

router.post("/api/updateUserWishlist", inserToWishlist); //for inserting data in wishlist

router.put("/api/putUser", putUser); //for updating a user profile

router.post("/api/deleteUser", deleteUser); //for deleting a user

router.post("/api/userLogin", findUser); //for user login

module.exports = router;

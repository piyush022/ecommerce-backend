//importing packages
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const { verifyToken } = require("./helper/helper");

//db connection
require("./db/connection");

//importing router
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const adminrouter = require("./routes/adminRoute");
const orderRouter = require("./routes/orderRoute");

//creating express app
const app = express();

//using middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  if (
    req.path === "/user/api/postUser" ||
    req.path === "/user/api/userLogin" ||
    req.path === "/admin/api/adminLogin"
  ) {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

//defining routes
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/admin", adminrouter);
app.use("/order", orderRouter);

//404 middleware

app.use((req, res) => {
  res.json({
    error: "404",
    message: "Route you were looking for was not found",
  });
});

//starting server

app.listen(5000, () => {
  console.log("Listening");
});

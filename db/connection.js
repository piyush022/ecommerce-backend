const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DBURL)
  .then((result) => console.log("connected"))
  .catch((err) => console.log(err));

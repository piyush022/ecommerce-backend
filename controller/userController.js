const userModel = require("../model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = 10;
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { generateToken } = require("../helper/helper");

//for creating a user
async function postUser(req, resp) {
  console.log(req.body);
  try {
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hash,
      email: req.body.email,
      phone: req.body.phone,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    const data = await user.save();
    resp.json({ success: true, msg: "user created successfuly" });
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

//for getting all user
async function getUser(req, resp) {
  try {
    const data = await userModel.find({});

    resp.json({ success: true, msg: "user found", data: data });
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

//for updating a user
async function putUser(req, resp) {
  try {
    let data;
    if (req.body.password) {
      const hash = bcrypt.hashSync(req.body.password, salt);
      data = await userModel.findByIdAndUpdate(req.body.id, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hash,
        email: req.body.email,
        phone: req.body.phone,
        wishlist: req.body.wishlist,
      });
    } else {
      data = await userModel.findByIdAndUpdate(req.body.id, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,

        email: req.body.email,
        phone: req.body.phone,
        wishlist: req.body.wishlist,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      });
    }

    resp.json({ success: true, msg: "user data updated" });
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

//for deleting a user
async function deleteUser(req, resp) {
  try {
    const data = await userModel.findByIdAndDelete(req.body.id);

    resp.json({ success: true, msg: "user record deleted" });
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

//for user login
async function findUser(req, resp) {
  try {
    const email = req.body.email;
    const phone = req.body.phone;
    if (email) {
      const data = await userModel.find({
        email: req.body.email,
      });
      // console.log(req.body.email);
      // console.log(req.body.password);
      if (data.length > 0) {
        const approvedStatus = data[0].approved;
        console.log("approvedStatus", approvedStatus);
        if (approvedStatus) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            const userData = { email: req.body.email, pass: req.body.password };
            const token = generateToken(userData);

            resp.json({
              success: true,
              msg: "user found",
              data: data,
              token: token,
            });
          } else {
            resp.json({
              success: false,
              msg: "password does not match",
              data: data,
            });
          }
        } else {
          resp.json({ success: false, msg: "user is not approved by admin" });
        }
      } else {
        resp.json({ success: false, msg: "email is incorrect", data: data });
      }
    } else {
      if (phone) {
        const data = await userModel.find({
          phone: req.body.phone,
        });
        console.log(req.body.phone);
        console.log(req.body.password);
        if (data.length > 0) {
          const approvedStatus = data[0].approved;
          if (approvedStatus) {
            if (bcrypt.compareSync(req.body.password, data[0].password)) {
              const userData = {
                phone: req.body.phone,
                pass: req.body.password,
              };
              const token = generateToken(userData);
              resp.json({
                success: true,
                msg: "user found",
                data: data,
                token: token,
              });
            } else {
              resp.json({
                success: false,
                msg: "password does not match",
                data: data,
              });
            }
          } else {
            resp.json({ success: false, msg: "user is not approved by admin" });
          }
        } else {
          resp.json({
            success: false,
            msg: "phone no. is incorrect",
            data: data,
          });
        }
      } else {
        resp.json({
          success: false,
          msg: "phone no. or email is incorrect",
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

//for user getting wishlist
async function getWishlist(req, resp) {
  try {
    const id = req.body.id;
    if (id) {
      const objId = new mongoose.Types.ObjectId(id);
      const data = await userModel.aggregate([
        {
          $match: { _id: objId },
        },
        {
          $lookup: {
            from: "products",
            localField: "wishlist",
            foreignField: "_id",
            as: "wishlistData",
          },
        },
      ]);

      resp.json({ success: true, msg: "wishlist data found", data: data });
    } else {
      resp.json({ success: false, msg: "user id is required" });
    }
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}

//for inserting to wishlist
async function inserToWishlist(req, resp) {
  const id = req.body.id;
  const item = req.body.item;
  try {
    const data = await userModel.findByIdAndUpdate(id, {
      $push: { wishlist: item },
    });
    resp.json({ success: true, msg: "Item added to wishlist" });
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}
module.exports = {
  postUser,
  getUser,
  putUser,
  deleteUser,
  findUser,

  getWishlist,
  inserToWishlist,
};

const adminModel = require("../model/adminModel");
const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const salt = 10;
const { generateToken } = require("../helper/helper");

async function insertadmin(req, res) {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const hash = bcrypt.hashSync(password, salt);
    const admin = new adminModel({
      firstname,
      lastname,
      email,
      phone,
      password: hash,
    });
    const result = await admin.save();
    res.status(201).json({ success: true, msg: "admin created", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function to update an existing admin
async function updateadmin(req, res) {
  try {
    const id = req.body.id;
    const { firstname, lastname, email, phone, password } = req.body;
    const result = await adminModel.findByIdAndUpdate(id, {
      firstname,
      lastname,
      email,
      phone,
      password,
    });
    if (!result) {
      return res.status(404).json({ message: "admin not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function to delete an admin
async function deleteadmin(req, res) {
  try {
    const id = req.body.id;
    const result = await adminModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "admin not found" });
    }
    res.json({ message: "admin deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function for admin login
const getadmin = async (req, resp) => {
  try {
    const email = req.body.email;
    const phone = req.body.phone;
    if (email) {
      const data = await adminModel.find({
        email: req.body.email,
      });
      // console.log(req.body.email);
      // console.log(req.body.password);
      if (data.length > 0) {
        if (bcrypt.compareSync(req.body.password, data[0].password)) {
          const userData = { email: req.body.email, pass: req.body.password };
          const token = generateToken(userData);

          resp.json({
            success: true,
            msg: "admin found",
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
        resp.json({ success: false, msg: "email is incorrect", data: data });
      }
    }
    if (phone) {
      const data = await adminModel.find({
        phone: req.body.phone,
      });
      // console.log(req.body.email);
      // console.log(req.body.password);
      if (data.length > 0) {
        if (bcrypt.compareSync(req.body.password, data[0].password)) {
          const userData = { phone: req.body.phone, pass: req.body.password };
          const token = generateToken(userData);

          resp.json({
            success: true,
            msg: "admin found",
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
        resp.json({ success: false, msg: "email is incorrect", data: data });
      }
    }
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

//user approval
async function approvalManage(req, resp) {
  try {
    const userId = req.body.id;
    const approvedData = req.body.approved;
    console.log(userId, approvedData);
    if (userId) {
      const user = await userModel.findByIdAndUpdate(userId, {
        approved: approvedData,
      });
      resp.json({ success: true, msg: "user approved status changed" });
    } else {
      resp.json({ success: false, msg: "some fields are missing" });
    }
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}

//order approval and status change
async function approveOrder(req, res) {
  try {
    const orderId = req.body.id;

    // Find the order by its ID
    const data = await orderModel.findByIdAndUpdate(orderId, {
      status: req.body.status,
    });

    res.status(200).json({ success: true, msg: "order status updated" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
}

async function getOrders(req, res) {
  try {
    const data = await orderModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "orderedProduct",
        },
      },
    ]);
    if (data.length) {
      res.status(200).json({ success: true, data: data, msg: "orders found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
}

module.exports = {
  insertadmin,
  updateadmin,
  deleteadmin,
  getadmin,
  approvalManage,
  approveOrder,
  getOrders,
};

const express = require("express");
const {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  deleteWarehouse,
  updateWarehouse,
} = require("../controller/wareHouseController");
const {
  insertadmin,
  updateadmin,
  deleteadmin,
  getadmin,
  approvalManage,
  approveOrder,
} = require("../controller/adminController");

const router = express.Router();

router.post("/api/postAdmin", insertadmin); //for creating admin

router.post("/api/adminLogin", getadmin); //for admin login

router.put("/api/putAdmin", updateadmin); //for updating admin

router.post("/api/deleteAdmin", deleteadmin); //for deleting admin

router.post("/api/userApproval", approvalManage); //for APPROVE/DISAPPROVE USER

router.post("/api/orderStatus", approveOrder); //for order status change

router.post("/api/createWarehouse", createWarehouse); //for creating warehouse

router.post("/api/getAllWarehouse", getWarehouses); //for getting all warehouses

router.post("/api/getSingleWarehouse", getWarehouseById); //for getting single warehouse

router.post("/api/deleteWarehouse", deleteWarehouse); //for deleting warehouse

router.post("/api/updateWarehouse", updateWarehouse); //for updating a warehouse

module.exports = router;

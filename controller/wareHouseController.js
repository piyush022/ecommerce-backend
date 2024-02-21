const Warehouse = require("../model/warehouseModel");

// to create a warehouse
async function createWarehouse(req, res) {
  try {
    const { warehouseName, locationName, coordinates } = req.body;
    if (warehouseName && locationName && coordinates) {
      const warehouse = new Warehouse({
        warehouseName,
        locationName,
        location: {
          type: "Point",
          coordinates: coordinates,
        },
      });

      // Save the warehouse to the database
      const savedWarehouse = await warehouse.save();
      res.json({
        success: true,
        data: savedWarehouse,
        msg: "warehouse created",
      });
    } else {
      res.json({
        success: false,
        msg: "some fields are missing",
      });
    }
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

// to get all warehouses
async function getWarehouses(req, res) {
  try {
    const warehouses = await Warehouse.find();
    res.json({ success: true, data: warehouses, msg: "warehouses found" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

// to get a single warehouse by ID
async function getWarehouseById(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.body.id);
    if (!warehouse) {
      res.json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, data: warehouse, msg: "warehouse found" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

// to delete a warehouse by ID
async function deleteWarehouse(req, res) {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.body.id);
    if (!warehouse) {
      res.json({ success: false, message: "Warehouse not deleted" });
    }
    res.json({ success: true, message: "Warehouse deleted successfully" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

// to update a warehouse by ID
async function updateWarehouse(req, res) {
  try {
    const { warehouseName, locationName, coordinates } = req.body;
    if (warehouseName && locationName && coordinates) {
      const warehouse = await Warehouse.findByIdAndUpdate(req.body.id, {
        warehouseName,
        locationName,
        coordinates,
      });
      if (!warehouse) {
        res.json({ success: false, message: "Warehouse not found" });
      }
      res.json({
        success: true,
        data: warehouse,
        message: "Warehouse updated",
      });
    } else {
      res.json({ success: false, message: "some fields are mising data" });
    }
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
}

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  deleteWarehouse,
  updateWarehouse,
};

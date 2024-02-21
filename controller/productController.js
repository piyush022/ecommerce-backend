const productModel = require("../model/productModel");
const wareHouseModel = require("../model/warehouseModel");
const mongoose = require("mongoose");
require("dotenv").config();

async function createProduct(req, resp) {
  try {
    const productName = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const warehouse = req.body.warehouse;
    if (productName && price && warehouse) {
      const product = new productModel({
        name: productName,
        description: description,
        price: price,
        quantity: quantity,
        warehouse: warehouse,
      });
      const data = await product.save();
      resp.json({ success: true, msg: "product created successfuly" });
    } else {
      resp.json({ success: false, msg: "productName and price are required" });
    }
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

async function getProducts(req, resp) {
  try {
    const data = await productModel.aggregate([
      {
        $lookup: {
          from: "warehouses",
          localField: "warehouse",
          foreignField: "_id",
          as: "warehouseData",
        },
      },
    ]);

    resp.json({ success: true, msg: "products found", data: data });
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

async function getProduct(req, resp) {
  try {
    console.log("function hit");
    const id = req.body.id;
    const mongooseId = new mongoose.Types.ObjectId(id);
    if (id) {
      const data = await productModel.aggregate([
        { $match: { _id: mongooseId } },
        {
          $lookup: {
            from: "warehouses",
            localField: "warehouse",
            foreignField: "_id",
            as: "wareHouseData",
          },
        },
      ]);

      resp.json({ success: true, msg: "product found", data: data });
    } else {
      resp.json({ success: false, msg: "product id is required" });
    }
  } catch (err) {
    console.log(err.message);
    resp.json({ success: false, msg: err.message });
  }
}

async function updateProduct(req, resp) {
  try {
    const id = req.body.id;
    const productName = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const warehouse = req.body.warehouse;
    if (id) {
      const result = await productModel.findByIdAndUpdate(id, {
        name: productName,
        description: description,
        price: price,
        quantity: quantity,
        warehouse: warehouse,
      });
      resp.json({ success: true, msg: "product updated" });
    } else {
      resp.json({ success: false, msg: "product id is required" });
    }
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}

async function deleteProduct(req, resp) {
  try {
    const id = req.body.id;
    if (id) {
      const data = await productModel.findByIdAndDelete(id);

      resp.json({ success: true, msg: "product deleted" });
    } else {
      const data = await productModel.findByIdAndDelete(id);

      resp.json({ success: false, msg: "product id is required" });
    }
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}

//get product by user location nearby 10 KM
async function getProductByLocation(req, resp) {
  try {
    const userLatitude = req.body.latitude;
    const userLongitude = req.body.longitude;
    const maxDistance = 10000;

    const data = await wareHouseModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(userLatitude), parseFloat(userLongitude)],
          },
          key: "location",
          distanceField: "distance.calculated",
          maxDistance: maxDistance,
          spherical: true,
        },
      },
    ]);

    if (data.length > 0) {
      const nearbyWarehouseIds = data.map((warehouse) => warehouse._id);
      const productsInNearbyWarehouses = await wareHouseModel.aggregate([
        {
          $match: {
            _id: { $in: nearbyWarehouseIds },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "warehouse",
            as: "productsInWarehouse",
          },
        },
      ]);

      resp.json({
        success: true,
        data: productsInNearbyWarehouses,
        msg: "products found in 10 km radius",
      });
    } else {
      resp.json({
        success: false,

        msg: "no nearby warehouses found near user's location",
      });
    }
  } catch (err) {
    resp.json({ success: false, msg: err.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductByLocation,
};

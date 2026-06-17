const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const { productName, category, stockStatus, unitPrice, tags } = req.body;

    if (!productName || !category || unitPrice === undefined) {
      return res.status(400).json({
        message: "productName, category and unitPrice are required",
      });
    }

    const existingProduct = await Product.findOne({ productName });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      productName,
      category,
      stockStatus,
      unitPrice,
      tags,
    });

    res.status(201).json({
      message: "Create product successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 }).lean();

    res.status(200).json({
      message: "Get products successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
};
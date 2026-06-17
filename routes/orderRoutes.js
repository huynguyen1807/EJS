const express = require("express");

const {
  getAllOrders,
  showCreateOrderForm,
  createOrder,
  showUpdateOrderForm,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getAllOrders);

router.get("/create-order", showCreateOrderForm);

router.post("/orders", createOrder);

router.get("/orders/:id/edit", showUpdateOrderForm);

router.put("/orders/:id", updateOrder);

router.delete("/orders/:id", deleteOrder);

module.exports = router;
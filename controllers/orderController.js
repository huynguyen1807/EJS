const Order = require("../models/orderModel");
const Product = require("../models/productModel");

function calculateTotalPrice(quantity, unitPrice) {
  const qty = Number(quantity);
  const price = Number(unitPrice);

  if (isNaN(qty) || qty <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (isNaN(price) || price < 0) {
    throw new Error("Unit price is invalid");
  }

  return qty * price;
}

function mapOrder(order) {
  return {
    ...order,
    id: order._id.toString(),
  };
}

function mapProduct(product, selectedProductName = null) {
  return {
    ...product,
    id: product._id.toString(),
    selected: product.productName === selectedProductName,
  };
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: 1 }).lean();

    const mappedOrders = orders.map(mapOrder);

    res.render("order", {
      orders: mappedOrders,
      message: req.query.message || null,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const showCreateOrderForm = async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 }).lean();

    const mappedProducts = products.map((product) => mapProduct(product));

    res.render("createOrder", {
      products: mappedProducts,
      error: null,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity, orderDate } = req.body;

    if (!customerName || !productName || !quantity || !orderDate) {
      const products = await Product.find().sort({ productName: 1 }).lean();

      return res.render("createOrder", {
        products: products.map((product) => mapProduct(product)),
        error: "All fields are required",
      });
    }

    const product = await Product.findOne({ productName }).lean();

    if (!product) {
      const products = await Product.find().sort({ productName: 1 }).lean();

      return res.render("createOrder", {
        products: products.map((product) => mapProduct(product)),
        error: "Product does not exist in the system",
      });
    }

    const totalPrice = calculateTotalPrice(quantity, product.unitPrice);

    await Order.create({
      customerName,
      productName,
      quantity,
      orderDate,
      totalPrice,
    });

    res.redirect("/?message=Order created successfully");
  } catch (error) {
    const products = await Product.find().sort({ productName: 1 }).lean();

    res.render("createOrder", {
      products: products.map((product) => mapProduct(product)),
      error: error.message,
    });
  }
};

const showUpdateOrderForm = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.redirect("/?message=Order not found");
    }

    const products = await Product.find().sort({ productName: 1 }).lean();

    const mappedOrder = mapOrder(order);

    const mappedProducts = products.map((product) =>
      mapProduct(product, order.productName)
    );

    res.render("updateOrder", {
      order: mappedOrder,
      products: mappedProducts,
      error: null,
    });
  } catch (error) {
    console.log("Show update order form error:", error.message);
    res.redirect("/?message=Invalid order ID");
  }
};

const updateOrder = async (req, res) => {
  try {
    const { customerName, productName, quantity, orderDate } = req.body;

    if (!customerName || !productName || !quantity || !orderDate) {
      const order = await Order.findById(req.params.id).lean();
      const products = await Product.find().sort({ productName: 1 }).lean();

      return res.render("updateOrder", {
        order: mapOrder(order),
        products: products.map((product) => mapProduct(product, productName)),
        error: "All fields are required",
      });
    }

    const product = await Product.findOne({ productName }).lean();

    if (!product) {
      const order = await Order.findById(req.params.id).lean();
      const products = await Product.find().sort({ productName: 1 }).lean();

      return res.render("updateOrder", {
        order: mapOrder(order),
        products: products.map((product) => mapProduct(product, productName)),
        error: "Product does not exist in the system",
      });
    }

    const totalPrice = calculateTotalPrice(quantity, product.unitPrice);

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        productName,
        quantity,
        orderDate,
        totalPrice,
      },
      {
        runValidators: true,
      }
    );

    res.redirect("/?message=Order updated successfully");
  } catch (error) {
    const order = await Order.findById(req.params.id).lean();
    const products = await Product.find().sort({ productName: 1 }).lean();

    res.render("updateOrder", {
      order: order ? mapOrder(order) : null,
      products: products.map((product) => mapProduct(product)),
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.redirect("/?message=Order deleted successfully");
  } catch (error) {
    res.redirect("/?message=Cannot delete order");
  }
};

module.exports = {
  getAllOrders,
  showCreateOrderForm,
  createOrder,
  showUpdateOrderForm,
  updateOrder,
  deleteOrder,
};
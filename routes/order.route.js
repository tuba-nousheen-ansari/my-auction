const express = require("express");
const orderController = require("../controller/order.controller");
const router = express.Router();
const token = require("../middleware/token.middleware");

router.post("/place-order", token.verifyToken, orderController.placeOrder);

router.post("/view-order", token.verifyToken, orderController.viewOrder);

router.post("/order", token.verifyToken, orderController.order);

router.post("/order-status", orderController.orderStatus);

module.exports = router;
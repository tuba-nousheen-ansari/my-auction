const express = require("express");
<<<<<<< HEAD
const adminRouter = require("./routes/admin.route");
const bodyParser = require("body-parser");
const bidRoute = require("./routes/bid.route");
const complaintRoute = require("./routes/complaint.route");
const orderRoute = require("./routes/order.route");
const customerRouter = require("./routes/customer.seller.route");
const path = require("path");
const productRouter = require("./routes/product.route");
=======
const adminRouter = require("./routes/admin.route")
const bodyParser = require('body-parser')
const bidRoute = require("./routes/bid.route")
const complaintRoute = require("./routes/complaint.route")
const orderRoute = require("./routes/order.route")
const Razorpay=require('razorpay')
const customerRouter = require("./routes/customer.seller.route")
const path = require("path")
const productRouter = require('./routes/product.route');
>>>>>>> 2d3c29718e08894e3b34f4b91e7cbe479a0e5a64
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://lucky:1234@cluster1.bvxkm.mongodb.net/E_auction?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("database is connected");
    })
    .catch((err) => {
        console.log(err);
        console.log("not connected");
    });

app.use(bodyParser.urlencoded({ extended: true }));
var instance = new Razorpay({ key_id: 'rzp_test_2ZGv8MA0qkfdTz', key_secret: 'sgWBJgIewU5cIMIXEGLPKR2g'})

app.use(bodyParser.json());

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "public")));

=======
app.use(express.static(path.join(__dirname, 'public')))
// dfffffffffffffffffffffffffasdfdsafdsa
>>>>>>> 2d3c29718e08894e3b34f4b91e7cbe479a0e5a64
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);
app.use("/bid", bidRoute);
app.use("/complaint", complaintRoute);
app.use("/order", orderRoute);
app.use("/product", productRouter);

app.listen(port, () => {
    console.log("application is runnning.....", 3000);
});
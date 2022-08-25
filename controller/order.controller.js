const orderModel = require("../model/order.model");
const Customer = require("../model/customer.model");
const fast2sms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const Product = require("../model/product.model");

var instance = new Razorpay({
    key_id: "rzp_test_2ZGv8MA0qkfdTz",
    key_secret: "sgWBJgIewU5cIMIXEGLPKR2g",
});

exports.order = (request, response) => {
    instance.orders.create({
            amount: request.body.total + "00",
            currency: "INR",
        },
        (err, order) => {
            if (err) {
                console.log(err);
            } else {
                console.log(order);
                console.log(request.body);
                // response.json(order);
                orderModel
                    .create(request.body)
                    .then((result) => {
                        Customer.findOne({ _id: result.userId })
                            .then((customer) => {
                                //email sending
                                let transporter = nodemailer.createTransport({
                                    host: "smtp.gmail.com",
                                    port: 587,
                                    secure: false,
                                    requireTLS: true,
                                    auth: {
                                        user: "bidauction23@gmail.com",
                                        pass: "brainforcode",
                                    },
                                });

                                var message = {
                                    from: "bidauction23@gmail.com",
                                    to: customer.email,
                                    subject: "Your Order Is Placed",
                                    html: `
                                       <h1>Order Will Be Deliver Soon</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
              `,
                                };

                                transporter.sendMail(message, (err, info) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(
                                            "SUCCESS===================================\n" + info
                                        );
                                    }
                                });

                                //sms sending
                                var option = {
                                    authorization: "AqpRDdaVo8JnHEXKQGliyYvB0594L7WkjPcmxrIe2hC3g1MfTtZbRkCjvVMgJFeuO483zPcBaxYdXmKW",
                                    message: "Congratulations!!! your order is succesfully placed.....",
                                    numbers: [result.mobile],
                                };
                                fast2sms.sendMessage(option);

                                return response
                                    .status(201)
                                    .json({ success: "Orderd Placed Successfully", data: order });
                            })
                            .catch((err) => {
                                return response
                                    .status(201)
                                    .json({ failed: "Ordered Not Placed......." });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        return response
                            .status(201)
                            .json({ failed: "Internal server Error" });
                    });
            }
        }
    );
};

exports.orderStatus = (request, response) => {
    console.log(request.body);
    instance.payments
        .fetch(request.body.razorpay_payment_id)
        .then((resultDetails) => {
            console.log(resultDetails);
            response.send("payment success");
        });
};

exports.placeOrder = (request, response) => {
    orderModel
        .create(request.body)
        .then((result) => {
            Customer.findOne({ _id: result.userId })
                .then((customer) => {
                    //email sending
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "bidauction23@gmail.com",
                            pass: "brainforcode",
                        },
                    });

                    var message = {
                        from: "bidauction23@gmail.com",
                        to: customer.email,
                        subject: "Your Order Is Placed",
                        html: `
                         <h1>Your Product Is Approved For Auction Now People Can Bid On Your Product</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
              `,
                    };

                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(
                                "SUCCESS===================================\n" + info
                            );
                        }
                    });

                    //sms sending
                    var option = {
                        authorization: "AqpRDdaVo8JnHEXKQGliyYvB0594L7WkjPcmxrIe2hC3g1MfTtZbRkCjvVMgJFeuO483zPcBaxYdXmKW",
                        message: "Congratulations!!! your order is succesfully placed.....",
                        numbers: [result.mobile],
                    };
                    fast2sms.sendMessage(option);

                    return response
                        .status(201)
                        .json({ success: "Orderd Placed Successfully" });
                })
                .catch((err) => {
                    return response
                        .status(201)
                        .json({ failed: "Ordered Not Placed......." });
                });
        })
        .catch((err) => {
            console.log(err);
            return response
                .status(201)
                .json({ error: "Internal Server Error......." });
        });
};

exports.viewOrder = (request, response) => {
    orderModel
        .findOne({
            userId: request.body.userId,
        })
        .populate("userId")
        .populate("productId")
        .then((result) => {
            return response.status(200).json(result);
        })
        .catch((err) => {
            return response
                .status(201)
                .json({ error: "Internal Server Error......." });
        });
};
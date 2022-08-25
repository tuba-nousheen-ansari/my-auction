const { response } = require("express");
const BID = require("../model/bid.model");
const { request } = require("express");
const bidModel = require("../model/bid.model");
const Customer = require("../model/customer.model");
const nodemailer = require("nodemailer");

exports.addBid = async(request, response) => {
    let bidModel = await BID.findOne({
        productId: request.body.productId,
    });

    if (!bidModel) {
        bidModel = new BID();
        bidModel.productId = request.body.productId;
    }
    bidModel.creator.push({
        buyersId: request.body.buyersId,
        priceValue: request.body.priceValue,
    });
    bidModel
        .save()
        .then((result) => {
            if (result)
                return response
                    .status(200)
                    .json({ data: result, succes: "Bid Added Successfully" });
        })
        .catch((err) => {
            return response.status(500).json({ error: "oops something went wrong" });
        });
};

exports.viewBidList = async(request, response) => {
    bidModel
        .find()
        .populate("creator.buyersId")
        .populate("productId")
        .then((result) => {
            if (result) return response.status(200).json(result);
            else return response.status(200).json({ messege: "Not Found" });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ err: "oops something went wrong" });
        });
};

exports.viewOneProductBid = async(request, response) => {
    bidModel
        .findOne({
            productId: request.body.productId,
        })
        .populate("creator.buyersId")
        .populate("productId")
        .then((result) => {
            if (result) {
                result.creator.sort((a, b) => {
                    return b.priceValue - a.priceValue;
                });
                return response.status(200).json(result);
            } else
                return response.status(200).json({ messege: "Result Not Found..." });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ err: "oops something went wrong" });
        });
};

exports.lockBid = (request, response) => {
    bidModel
        .updateOne({
            productId: request.body.productId,
            "creator.buyersId": request.body.buyersId,
        }, { $set: { "creator.$.isApproved": true } })
        .then((result) => {
            console.log(result);
            if (result.modifiedCount == 1) {
                Customer.findOne({ _id: request.body.buyersId })
                    .then((customer) => {
                        if (customer) {
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
                                subject: "Hurray!!",
                                html: `
                                <h1>Dear,` +
                                    customer.username +
                                    ` </h1>
                                    <br>
                                    <p>Your bid is highest so you won the auction.</p>
                                    <br>
                                    <p>Go fast and place your order</p>
                                <a href="">Place Order</a>`,
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
                            return response.status(200).json({
                                result: result,
                                success: "Updated Successfully",
                                customer: customer,
                            });
                        }
                    })
                    .catch((err) => {});
            } else
                return response.status(200).json({ messege: "Result Not Found..." });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ err: "oops something went wrong" });
        });
};

exports.biddedProduct = (request, response) => {
    bidModel
        .find({
            // productId: request.body.productId,
            "creator.buyersId": request.body.buyersId,
        })
        .populate("creator.buyersId")
        .populate("productId")
        .then((result) => {
            if (result) return response.status(200).json(result);
            else return response.status(200).json({ messege: "Not Found" });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ err: "oops something went wrong" });
        });
};
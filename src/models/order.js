const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAddress.address",
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                payPrice: {
                    type: Number,
                    required: true,
                },
                purchaseQuantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "cancelled", "refund"],
            required: true,
        },
        paymentType: {
            type: String,
            enum: ["cash", "card"],
            required: true,
        },
        progress: {
            type: Number,
            required:true,
        },
       
        orderStatus: [
            {
                type: {
                    type: String,
                    enum: ["ordered", "packed", "shipped", "delivered"],
                    default: "ordered",
                },
                date: {
                    type: Date,
                },

                isCompleted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

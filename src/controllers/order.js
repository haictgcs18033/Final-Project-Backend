const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const stripe = require("stripe")(process.env.STRIPE_SK);
exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id })
    .exec()
    .then((result) => {
      if (result) {
        req.body.user = req.user._id;
        req.body.orderStatus = [
          {
            type: "ordered",
            date: new Date(),
            isCompleted: true,
          },
          {
            type: "packed",
            isCompleted: false,
          },
          {
            type: "shipped",
            isCompleted: false,
          },
          {
            type: "delivered",
            isCompleted: false,
          },
        ];
        const order = new Order(req.body);
        order
          .save()
          .then((order) => {
            return res.status(200).json({ order });
          })
          .catch((error) => {
            return res.status(400).json({ error });
          });
      }
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};
exports.getOrder = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id items paymentStatus paymentType")
    .populate("items.product", "_id name productPictures reviews ")
    .exec()
    .then((order) => {
      return res.status(200).json({ order });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};
exports.getOneOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.product", "_id name productPictures ")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
exports.paymentByCard = async (req, res, next) => {
  const { amount, paymentMethodId, emailUser, product } = req.body;
  const customer = await stripe.customers.create({
    email: emailUser,
  });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "USD",
      payment_method: paymentMethodId,
      description: "A new charge from FES",
      customer: customer.id,
      metadata: {
        Products: product,
      },
      confirm: true,
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};

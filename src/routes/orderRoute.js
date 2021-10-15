var express = require("express");
const {
  getOrder,
  addOrder,
  getOneOrder,
  paymentByCard,
} = require("../controllers/order");
const {
  requireSignin,
  sendEmailCardPayment,
} = require("../middleware/middleware");
const router = express.Router();
router.get("/", requireSignin, getOrder);
router.post("/add-order", requireSignin, addOrder);
router.post("/get-one-order", requireSignin, getOneOrder);
// router.post('/paymentCard',requireSignin,paymentByCard,addOrder)
router.post(
  "/paymentCard",
  requireSignin,
  sendEmailCardPayment,
  paymentByCard,
  addOrder
);

module.exports = router;

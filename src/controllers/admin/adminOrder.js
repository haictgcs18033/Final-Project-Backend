
const Order = require('../../models/order')

exports.updateOrderStatus = (req, res) => {
   
    Order.updateOne({ _id: req.body.orderId, "orderStatus.type": req.body.type }, {
        $set: {
            "orderStatus.$": [{
                type: req.body.type,
                date: new Date(),
                isCompleted: true
            }],
            "progress": req.body.progress,
             paymentStatus:req.body.paymentStatus
        }
    }).exec()
        .then(result => {
            return res.status(200).json({ result })
        })
        .catch(err => {
            return res.status(400).json({ err })
        })
}
exports.getCustomerOrders = async (req, res) => {
    const orders = await Order.find({}).populate('items.product', 'name').exec()
    res.status(200).json({ orders })
}
exports.deleteCustomerOrders = async (req, res) => {
    Order.deleteOne({ _id: req.body.orderId }).exec()
        .then(result => {
            res.status(200).json({ result })
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}
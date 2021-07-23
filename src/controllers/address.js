const UserAddress = require('../models/address')
exports.addAddress = (req, res) => {
    const { payload } = req.body;
    if (payload.address) {
        // if (payload.address._id) {
        //     UserAddress.findOneAndUpdate(
        //         { user: req.user._id, "address._id": payload.address._id },
        //         {
        //             $set: {
        //                 "address.$": payload.address,
        //             },
        //         }
        //     ).exec((error, address) => {
        //         if (error) return res.status(400).json({ error });

        //         if (address) {
        //             return res.status(201).json({ address });
        //         }
        //     });
        // } else {
        //     UserAddress.findOneAndUpdate({ user: req.user._id },
        //         {
        //             $push: {
        //                 address: payload.address,
        //             },
        //         },
        //         { new: true, upsert: true }
        //     ).exec((error, address) => {
        //         if (error) return res.status(400).json({ error });

        //         if (address) {
        //             return res.status(201).json({ address });
        //         }
        //     });
        // }
        UserAddress.findOneAndUpdate({ user: req.user._id },
            {
                $push: {
                    address: payload.address,
                },
            },
            { new: true, upsert: true }
        ).exec((error, address) => {
            if (error) return res.status(400).json({ error });

            if (address) {
                return res.status(201).json({ address });
            }
        });
    } else {
        res.status(400).json({ error: "You need to provide address" });
    }
}
exports.updateAddress = (req, res) => {
    const { payload } = req.body;
    if (payload.address) {
        if (payload.address._id) {
            UserAddress.findOneAndUpdate(
                { user: req.user._id, "address._id": payload.address._id },
                {
                    $set: {
                        "address.$": payload.address,
                    },
                }
            ).exec((error, address) => {
                if (error) return res.status(400).json({ error });

                if (address) {
                    return res.status(201).json({ address });
                }
            });
        } else {
            res.status(400).json({ error: "address no found" });
        }

    } else {
        res.status(400).json({ error: "You need to provide address" });
    }
}
exports.getAddress = (req, res) => {
    UserAddress.findOne({ user: req.user._id })
        .exec()
        .then(userAddress => {
            if (userAddress) {
                return res.status(200).json({ userAddress })
            } else {
                return res.status(200).json({ message: 'No Address Found' })
            }

        })
        .catch(error => {
            return res.status(400).json({ error })
        });
};
exports.removeAddress = (req, res) => {
    const { addressId } = req.body
    if (addressId) {
        UserAddress.updateOne({ user: req.user._id }, {
            $pull: {
                "address": {
                    "_id":addressId
                }
            }
        },{multi:true}).exec()
            .then(output => {
                return res.status(200).json({ output })
            })
            .catch(err => {
                return res.status(400).json({ err })
            });
    }

}
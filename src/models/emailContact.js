const mongoose = require("mongoose");

const emailContactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
   
    },
    { timestamps: true }
)
module.exports = mongoose.model("EmailContact", emailContactSchema);
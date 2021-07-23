const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    userImage: {
        type: String
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowecase: true
    },
    hash_password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    contactNumber: {
        type: String,
    },
    profilePicture: {
        img: {
            type: String
        }

    }
    ,

}, { timestamps: true })
// userSchema.virtual('password').set(
//     function (password) {
//         this.hash_password = bcrypt.hashSync(password, 10)
//     }
// )
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})
userSchema.methods = {
    authenticate: async function (password) {
        // bcypt.compareSync return the promise so we need to use async await or then/catch to resolve it 
        return await bcrypt.compareSync(password, this.hash_password)
    }
}
module.exports = mongoose.model('User', userSchema)

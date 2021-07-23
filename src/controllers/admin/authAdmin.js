const User = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const shortid = require('shortid')
exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec((error, user) => {
            if (user) return res.status(404).json({
                message: "Admin already registered"
            })
            const { firstName, lastName, email, password } = req.body
            const hash_password = bcrypt.hashSync(password, 10)
            const _user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                hash_password,
                // password: password,
                username: shortid.generate(),
                role: 'admin'
            })

            _user.save((error, data) => {
                if (error) {
                    // console.log(error);
                    return res.status(400).json({
                        message: 'Something went wrong'
                    })
                }
                if (data) {
                    return res.status(201).json({
                        user: data,
                        message: 'Admin registed succcessfully'
                    })
                }
            })
        })
}
exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (error) {
                return res.status(400).json(error)
            }
            if (user) {
                if (await user.authenticate(req.body.password) && user.role === 'admin') {
                    // console.log(user);
                    // if we want to check the return value from authenticate function we need to use a async await as following code 
                    // E.g: let isPassword= await user.authenticate(req.body.password)
                    // Note : we need to use async await together . Async will be placed before function (e.g : async(error,user))
                    const token = jwt.sign(
                        {
                            _id: user._id,
                            role: user.role,
                            emailGoogle: req.adminAuthorize.email,
                            passwordGoogle: req.adminAuthorize.password
                        }, process.env.TOKEN)
                    const { _id, firstName, lastName, email, role, fullName } = user;
                    // res.cookie('token',token,{expiresIn:'1h'})
                    res.status(200).json({
                        token,
                        user: {
                            _id, firstName, lastName, email, role, fullName
                        }
                    })
                } else {
                    return res.status(400).json({
                        message: 'Invalid Password'
                    })
                }
            }
            if (!user) return res.status(404).json({
                message: 'Email or password wrong'
            })
        })
}
// exports.requireSignin = (req, res, next) => {
//     const token = req.headers.authorization.split(" ")[1];
//     const user = jwt.verify(token, process.env.TOKEN);
//     req.user = user;
//     next();
// }
// exports.signout=(req,res)=>{
//        res.clearCookie('token');
//        res.status(200).json({
//            message:'Signout Successfully'
//        })
// }
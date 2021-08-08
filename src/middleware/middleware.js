const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const nodemailer = require('nodemailer');
const User = require('../models/userModel')
exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.TOKEN);
        req.user = user;
    } else {
        return res.status(400).json({
            msg: 'authorization required'
        })
    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(400).json({
            message: 'Customer Access Denied'
        })
    }
    next()
}
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({
            message: 'Admin Access Denied'
        })
    }
    next()
}
exports.trimRequest = (req, res, next) => {
    if (req.method === "GET") {
        for (let [key, value] of Object.entries(req.query)) {
            req.query[key] = value.trim()
        }
    }
    next()
}
exports.pagination = (model) => {
    return async (req, res, next) => {
        const searchTerm = req.query.searchTerm
        const sortObject = req.query.sortObject
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = {}
        if (endIndex < await model.countDocuments().exec()) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            }
        }

        try {
            if (!sortObject) {
                result.paginate = await model.find(
                    { email: { $regex: new RegExp(searchTerm, 'i') } }
                ).skip(startIndex).limit(limit).exec()

                res.resultPaginated = result
            }
            else if (sortObject === 'ascending') {
                result.paginate = await model.find(
                    { email: { $regex: new RegExp(searchTerm, 'i') } }
                )
                    .sort({ firstName: 1 })
                    .skip(startIndex).limit(limit).exec()
                res.resultPaginated = result
            }
            else if (sortObject === 'decending') {
                result.paginate = await model.find(
                    { email: { $regex: new RegExp(searchTerm, 'i') } }
                )
                    .sort({ firstName: -1 })
                    .skip(startIndex).limit(limit).exec()
                res.resultPaginated = result

            }
            else if (sortObject === 'newest') {
                result.paginate = await model.find(
                    { email: { $regex: new RegExp(searchTerm, 'i') } }
                )
                    .sort({ createdAt: -1 })
                    .skip(startIndex).limit(limit).exec()
                res.resultPaginated = result
            }
            else if (sortObject === 'oldest') {
                result.paginate = await model.find(
                    { email: { $regex: new RegExp(searchTerm, 'i') } }
                )
                    .sort({ createdAt: 1 })
                    .skip(startIndex).limit(limit).exec()
                res.resultPaginated = result
            }
            next()
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}

exports.adminAuthorize = (req, res, next) => {
    const { email, password } = req.body
    adminAuthorize = {
        email: email,
        password: password,
    }
    req.adminAuthorize = adminAuthorize
    next()
}
exports.sendEmail = async (req, res, next) => {
    const { title, description, emailUser, type } = req.body
    const { emailGoogle, passwordGoogle } = req.user
    const emailForSave = {
        title: title,
        description: description
    }
    req.email = emailForSave
    let output = ''
    if (type === 'specific') {
        output = `
        <h2>Hello ${emailUser}</h2>
        <h5>${title}</h5>
        <p>${description}</p>
        `
        User.findOne({ email: emailUser }).exec((err, user) => {
            if (err) {
                return res.status(400).json({ message: err })
            }
            if (user) {
                // return res.status(200).json(user)
                async function main() {
                    let transporter = await nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: `${emailGoogle}`,
                            pass: `${passwordGoogle}`
                        }
                    })
                    let email = await transporter.sendMail({
                        from: ` FES <${emailGoogle}>`,
                        to: `${emailUser}`, // list of receivers
                        subject: "FES Notification", // Subject line
                        text: "Hello world?", // plain text body
                        html: `
                        <h2>Hello ${user.firstName} ${user.lastName}</h2>
                        <h5>${title}</h5>
                        <p>${description}</p>
                        `, // html body
                    })
                    console.log(email.messageId);
                    console.log('email has been sent')
                    next()
                }
                main().catch(err => {
                    res.status(400).json({ message: 'You need to provide your gmail google for conducting this feature' });
                })
            }
        })
    } else if (type === "all") {
        output = `
        <h2>Hello</h2>
        <h5>${title}</h5>
        <p>${description}</p>
        `
        User.find({}).exec((err, user) => {
            if (err) {
                return res.status(400).json({ message: err })
            }
            if (user) {
                console.log(user)
                // return res.status(200).json(user)


                async function main() {
                    let transporter = await nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: `fesdvktest@gmail.com`,
                            pass: process.env.FES_ADMIN_PASSWORD
                        }
                    })
                    let email = await transporter.sendMail({
                        from: ` FES <${emailGoogle}>`,
                        to: `${user.filter(customer => customer.role === 'customer').map((user) => {
                            return user.email
                        })}`, // list of receivers
                        subject: "FES Notification", // Subject line
                        text: "Hello world?", // plain text body
                        html: output, // html body
                    })
                    console.log(email.messageId);
                    console.log('email has been sent')
                    next()
                }
                main().catch(err => {
                    res.status(400).json({ message: 'You need to provide your gmail google for conducting this feature' });
                })
            }
        })

    }

}
exports.sendEmailCreateAccount = async (req, res, next) => {
    const { email, firstName, lastName, role } = req.body
    const emailUser = email
    const { emailGoogle, passwordGoogle } = req.user
    const password = await shortid.generate()
    const userAccount = {
        email: emailUser,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role
    }
    req.userAccount = userAccount

    let output = ''
    if (role === 'customer') {
        output = `
        <h3>Welcome to FES</h3>
        <p>Here is your account</p>
        <div>
             <p>Email : ${email}</p>   
             <p>Password : ${password}</p>
        </div>
      `
    } else if (role === 'admin') {
        output = `
        <h3>Welcome you to become FES ADMIN </h3>
        <p>Here is your account</p>
        <div>
             <p>Email : ${email}</p>   
             <p>Password : ${password}</p>
          
        </div>
      `
    }
    User.findOne({ email: email }).exec((err, user) => {
        if (err) return res.status(404).json({ message: err })
        if (user) {
            return res.status(404).json({ message: 'Email already exists' })
        } else {
            async function main() {
                let transporter = await nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: `fesdvktest@gmail.com`,
                        pass: process.env.FES_ADMIN_PASSWORD
                    }
                })
                let email = await transporter.sendMail({
                    from: ` FES <${emailGoogle}>`,
                    to: `${emailUser}`, // list of receivers
                    subject: "FES Notification", // Subject line
                    text: "Welcome to FES", // plain text body
                    html: output, // html body
                })
                console.log(email.messageId);
                console.log('email has been sent')
                next()
            }
            main().catch(err => {
                res.status(400).json({ message: 'You need to provide your gmail google for conducting this feature' });
            })
        }
    })

}
exports.sendEmailCardPayment = (req, res, next) => {
    let {
        time,
        date,
        emailUser,
        product
    } = req.body
    let output = `
    <div>
    <p>Thank you for trusting and choosing FES as a place for you to shop for your favorite fashion products.</p>
    <p>Products you have purchased including : ${product}</p>
    <p> Time you paid online : ${date} , ${time}</p>
    </div>
    <div>
    <img src="https://fes-server-backend.s3.ap-southeast-1.amazonaws.com/thankyou.png"/>
    </div>
    `
    User.findOne({ email: emailUser }).exec((err, user) => {
        if (err) {
            console.log(err)
            // return res.status(404).json({ message: err })
        } else {
            async function main() {
                let transporter = await nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: `fesdvktest@gmail.com`,
                        pass: process.env.FES_ADMIN_PASSWORD
                    }
                })
                let email = await transporter.sendMail({
                    from: ` FES <fesdvktest@gmail.com>`,
                    to: `${emailUser}`, // list of receivers
                    subject: "FES Notification", // Subject line
                    text: "Thank you very much", // plain text body
                    html: output, // html body
                })
                console.log(email.messageId);
                console.log('email has been sent')
                next()
            }
            main().catch(err => {
                console.log(err)
                res.status(400).json({ message: 'You need to provide your gmail google for conducting this feature' });
            })
        }
    })

}

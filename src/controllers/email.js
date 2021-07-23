const Email = require('../models/email')
exports.getEmail = (req, res) => {
    const sortObject = req.query.sortObject
    if (!sortObject) {
        Email.find({}).exec((err, email) => {
            if (err) return res.status(404).json({ message: err })
            if (email) {
                return res.status(200).json(email)
            }
        })
    }
    else if (sortObject === "newest") {
        Email.find({}).sort({ createdAt: -1 }).exec((err, email) => {
            if (err) return res.status(404).json({ message: err })
            if (email) {
                return res.status(200).json(email)
            }
        })
    }
    else if(sortObject==="oldest"){
        Email.find({}).sort({ createdAt: 1 }).exec((err, email) => {
            if (err) return res.status(404).json({ message: err })
            if (email) {
                return res.status(200).json(email)
            }
        })
    }

}
exports.createMail = (req, res) => {
    let { title, description } = req.email
    let email = new Email({
        title: title,
        description: description
    })
    email.save((err, email) => {
        if (err) {
            return res.status(404).json({ message: err })
        }
        if (email) {
            return res.status(200).json({ message: 'Send mail successfully' })
        }
    })
    // res.send('Success')
}
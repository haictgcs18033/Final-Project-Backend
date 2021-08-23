const User = require('../models/userModel')
const EmailContact = require('../models/emailContact')
const shortid = require('shortid')
const bcrypt = require('bcrypt')

exports.getUserPaginate = (req, res) => {
  res.send(res.resultPaginated)
}
exports.getAllUser = (req, res) => {
  User.find({}).exec((err, user) => {
    if (err) return res.status(400).json({ err })
    if (user) {
      return res.status(200).json(user)
    }
  })
}
exports.addUser = async (req, res) => {
  // const { firstName, lastName } = req.body
  // let fullName = firstName + ' ' + lastName
  const { email, password, firstName, lastName, role } = req.userAccount
  const hash_password = await bcrypt.hashSync(password, 10)
  const _user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    hash_password,
    role: role,
    username: shortid.generate()
  })
  _user.save((error, data) => {
    if (error) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
    if (data) {
      return res.status(201).json({
        user: data,
        message: 'Create user succcessfully'
      })
    }
  })
}
exports.updateUser = (req, res) => {
  const { firstName, lastName, email, role } = req.body
  User.updateOne({ _id: req.body.userId }, {
    $set: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
    }
  }).exec()
    .then(result => {
      res.status(200).json({ message: 'Update User Successfully' })
    })
    .catch(err => {
      res.status(400).json({ message: err })
    })
}
exports.deleteUser = async (req, res) => {
  User.deleteOne({ _id: req.body.userId }).exec()
    .then(result => {
      res.status(200).json({ message: 'Delete successfully' })
    })
    .catch(err => {
      res.status(400).json({ message: err })
    })

}
exports.getEmailUser=(req,res)=>{
  EmailContact.find({}).exec((err,email)=>{
    if(err) return res.status(404).json({message:err})
    if(email){
      return res.status(200).json(email)
    }
  })
}
exports.emailContactController = (req, res) => {
    const {emailUser}=req.body
    EmailContact.findOne({email:emailUser}).exec((err,email)=>{
      if(err) return res.status(404).json({message:err})
      if(email) return res.status(400).json({message:'You have used this email to contact us. Please wait a few days for us to approve'})
      if(!email){
        let _email=new EmailContact({
          email:emailUser
        })
        _email.save((err,data)=>{
          if(err) return res.status(404).json({message:err})
          if(data){
            return res.status(200).json({message:'Contact Successfully'})
          }
        })
      }
    })
}

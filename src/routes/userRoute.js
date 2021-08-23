const express = require('express')
const { signup, signin, changePassword, loginGoogle, loginFacebook, updateUserDetail, getUserDetail, forgetPassword, resetPassword } = require('../controllers/authUser')
const {requireSignin, userMiddleware}=require('../middleware/middleware')
// Validation 

const { validateSignupRequest, isRequestValidated,validateSigninRequest } = require('../validators/auth')
const router = express.Router()
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')
// Aws Multer
const aws = require('aws-sdk')
var s3 = new aws.S3({
  accessKeyId:process.env.ACCESS_KEY_ID,
  secretAccessKey:process.env.SECCRET_KEY_ID
})
const multerS3 = require('multer-s3')
const { emailContactController } = require('../controllers/user')

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'fes-server-backend',
    acl:'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })
})
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       // __dirname is the directory of the file we are using,
//       // dirname method tham chieu den directory cua __dirname
//       cb(null, path.join(path.dirname(__dirname), 'uploads'))
//     },
//     filename: function (req, file, cb) {
//       cb(null, shortid.generate() + '-' + file.originalname)
//     }
//   })
// const upload = multer({ storage: storage })
// Import Schema

router.post('/signin',validateSigninRequest,isRequestValidated,signin)
router.post('/signup',validateSignupRequest,isRequestValidated, signup)
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword)
router.post('/googleLogin',loginGoogle)
router.post('/facebookLogin',loginFacebook)
router.post('/getUserDetail',requireSignin,getUserDetail)
router.post('/changePassword',requireSignin,changePassword)
router.post('/updateUserDetail',requireSignin,upload.single('userImage'),updateUserDetail)
router.post('/emailContact',emailContactController)

module.exports = router

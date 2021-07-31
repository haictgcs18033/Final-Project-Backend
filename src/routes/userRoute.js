const express = require('express')
const { signup, signin, changePassword, loginGoogle, loginFacebook, updateUserDetail, getUserDetail, forgetPassword, resetPassword } = require('../controllers/authUser')
const {requireSignin, userMiddleware}=require('../middleware/middleware')
// Validation 

const { validateSignupRequest, isRequestValidated,validateSigninRequest } = require('../validators/auth')
const router = express.Router()
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // __dirname is the directory of the file we are using,
      // dirname method tham chieu den directory cua __dirname
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })
const upload = multer({ storage: storage })
// Import Schema

router.post('/signin',validateSigninRequest,isRequestValidated,signin)
router.post('/signup',validateSignupRequest,isRequestValidated, signup)
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword)
router.post('/googleLogin',loginGoogle)
router.post('/facebookLogin',loginFacebook)
router.post('/getUserDetail',requireSignin,userMiddleware,getUserDetail)
router.post('/changePassword',requireSignin,userMiddleware,changePassword)
router.post('/updateUserDetail',requireSignin,userMiddleware,upload.single('userImage'),updateUserDetail)

module.exports = router

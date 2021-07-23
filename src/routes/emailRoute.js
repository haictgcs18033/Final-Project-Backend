const express=require('express')
const { getEmail, createMail } = require('../controllers/email')
const { sendEmail, requireSignin, adminMiddleware } = require('../middleware/middleware')
const router=express.Router()
router.get('/getAllEmail',requireSignin,adminMiddleware,getEmail)
router.post('/addMail',requireSignin,adminMiddleware,sendEmail,createMail)
module.exports=router
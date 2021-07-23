const express=require('express')
const { addAddress, getAddress, updateAddress, removeAddress } = require('../controllers/address')
const { requireSignin,userMiddleware } = require('../middleware/middleware')
const router=express.Router()
router.get('/',requireSignin,userMiddleware,getAddress)
router.post('/add-address',requireSignin,userMiddleware,addAddress)
router.post('/update-address',requireSignin,userMiddleware,updateAddress)
router.post('/delete-address',requireSignin,userMiddleware,removeAddress)
module.exports=router
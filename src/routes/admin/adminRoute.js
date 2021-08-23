const express = require('express')
const { signup, signin } = require('../../controllers/admin/authAdmin')
const { validateSigninRequest, isRequestValidated } = require('../../validators/auth')
const {requireSignin, adminMiddleware, pagination, sendEmailCreateAccount, adminAuthorize}=require('../../middleware/middleware')
const { updateOrderStatus, getCustomerOrders, deleteCustomerOrders } = require('../../controllers/admin/adminOrder')
const {  addUser, getAllUser, getUserPaginate, deleteUser, updateUser, getEmailUser } = require('../../controllers/user')
const User=require('../../models/userModel')
const router = express.Router()
// Import Schema
router.post('/signin',adminAuthorize,validateSigninRequest,isRequestValidated, signin)
router.post('/signup',validateSigninRequest,isRequestValidated, signup)
// router.post('/signout',requireSignin,signout)
// router.post('/post',requireSignin,(req,res)=>{
//     res.send('post')
// })
router.post('/orderStatus',requireSignin,adminMiddleware,updateOrderStatus)
router.get('/getOrder',requireSignin,adminMiddleware,getCustomerOrders)
router.post('/deleteOrder',requireSignin,adminMiddleware,deleteCustomerOrders)
router.get('/getUserPaginate',requireSignin,adminMiddleware,pagination(User),getUserPaginate)
router.get('/getAllUser',getAllUser)
router.post('/addUser',requireSignin,adminMiddleware,sendEmailCreateAccount,addUser)
router.post('/updateUser',requireSignin,adminMiddleware,updateUser)
router.post('/deleteUser',requireSignin,adminMiddleware,deleteUser)
router.get('/emailUser',requireSignin,adminMiddleware,getEmailUser)

module.exports = router
    
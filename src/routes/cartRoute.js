const express = require('express')
const { getCart, addCart, decremental, removeFromCart } = require('../controllers/cart')
const { requireSignin,userMiddleware } = require('../middleware/middleware')
const router = express.Router()


router.get('/',requireSignin, getCart)
router.post('/user/add-to-cart',requireSignin,userMiddleware,addCart)
router.post('/user/decremental-cart',requireSignin,userMiddleware,decremental)
router.post('/delete',requireSignin,userMiddleware,removeFromCart)
module.exports = router
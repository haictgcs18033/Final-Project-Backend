const express = require('express')

const { initialDataController } = require('../../controllers/admin/initialDataController')
const { requireSignin, adminMiddleware } = require('../../middleware/middleware')


const router = express.Router()
// Import Schema


router.post('/',requireSignin,adminMiddleware, initialDataController)

module.exports = router
    
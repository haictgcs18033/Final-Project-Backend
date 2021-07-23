const express = require('express')
const router = express.Router()

const { categoryAdd, getCategory, updateCategory, deleteCategory } = require('../controllers/category')
const { requireSignin, adminMiddleware } = require('../middleware/middleware')
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
router.get('/', getCategory)
router.post('/add', requireSignin, adminMiddleware, upload.single('categoryImage'), categoryAdd)
router.post('/update',requireSignin,adminMiddleware,upload.array("categoryImage"),updateCategory)
router.post('/delete',requireSignin,adminMiddleware,deleteCategory)
module.exports = router
const express = require('express')
const router = express.Router()

const { categoryAdd, getCategory, updateCategory, deleteCategory } = require('../controllers/category')
const { requireSignin, adminMiddleware } = require('../middleware/middleware')
const multer = require('multer')
const shortid = require('shortid')
// Aws Multer
const aws = require('aws-sdk')
var s3 = new aws.S3({
  accessKeyId:process.env.ACCESS_KEY_ID,
  secretAccessKey:process.env.SECCRET_KEY_ID
})
const multerS3 = require('multer-s3')
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
// Multer Normal
// const path = require('path')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // __dirname is the directory of the file we are using,
//     // dirname method tham chieu den directory cua __dirname
//     cb(null, path.join(path.dirname(__dirname), 'uploads'))
//   },
//   filename: function (req, file, cb) {
//     cb(null, shortid.generate() + '-' + file.originalname)
//   }
// })
// const upload = multer({ storage: storage })
router.get('/', getCategory)
router.post('/add', requireSignin, adminMiddleware, upload.single('categoryImage'), categoryAdd)
router.post('/update',requireSignin,adminMiddleware,upload.single("categoryImage"),updateCategory)
router.post('/delete',requireSignin,adminMiddleware,deleteCategory)
module.exports = router
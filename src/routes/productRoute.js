const express = require('express')
const { getProduct, productAdd, getProductItemBySlug, getProductDetailById,
  productUpdate, productDelete, addProductReview,
  getProductPaginate,
  getPaginateAllProduct,
  getAllProductBySlug, 
  } = require('../controllers/product')

const { requireSignin, adminMiddleware, trimRequest} = require('../middleware/middleware')
const router = express.Router()
const multer = require('multer')
const shortid = require('shortid')
// AWS Multer
const aws = require('aws-sdk')
var s3 = new aws.S3({
  accessKeyId:'AKIA2CND24UTRGYI7U2U',
  secretAccessKey:'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'
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
// Normal multer
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

// Upload one image
// router.post('/add',requireSignin,adminMiddleware,upload.single('productPicture'), productAdd)
// Upload multiple images
router.post('/add', requireSignin, adminMiddleware, upload.array('productPicture'), productAdd)
router.post('/productUpdate', requireSignin, adminMiddleware, upload.array('productPicture'), productUpdate)
router.get('/', getProduct)
router.get('/getProductPaginate', requireSignin, adminMiddleware, getProductPaginate)
router.post('/productDelete', requireSignin, adminMiddleware, productDelete)
router.get('/productItemPaginate/:slug', getProductItemBySlug)
router.get('/allProductBySlug/:slug',getAllProductBySlug)
router.get('/getAllProduct',getProduct)
router.get('/allProductPaginate',trimRequest,getPaginateAllProduct)
router.get('/productDetail/:productId', getProductDetailById)
router.post('/productDetail/add-review/', requireSignin, addProductReview)

module.exports = router

const express= require('express');
const router =express.Router();
const multer=require('multer')
const shortid=require('shortid')
const path=require('path')
const { requireSignin, adminMiddleware } = require('../middleware/middleware');
const { createPage, getPage } = require('../controllers/page');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // __dirname is the directory of the file we are using,
        // dirname method tham chieu den directory cua __dirname
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate()+'-'+file.originalname)
    }
  })
const upload=multer({storage:storage})
router.post('/createPage',requireSignin,adminMiddleware,upload.fields(
    [
        {name:'bannerImages'},
        {name:'productImages'}
    ]
),createPage)
router.get('/:categoryId/:type',getPage)
module.exports=router
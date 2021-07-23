const Page = require('../models/page')

exports.createPage = (req, res) => {
    const { bannerImages, productImages } = req.files
    if (bannerImages.length > 0) {
        req.body.bannerImages = bannerImages.map((bannerImage) => ({
            img: `${process.env.APP_API}/public/${bannerImage.filename}`,
            navigate: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }
    if (productImages.length > 0) {
        req.body.productImages = bannerImages.map((productImage) => ({
            img: `${process.env.APP_API}/public/${productImage.filename}`,
            navigate: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }
    req.body.createdBy = req.user._id;
    Page.findOne({ category: req.body.category })
        .exec().then(page => {
            // If Page is old we update It 
            if (page) {
                Page.findOneAndUpdate({ category: req.body.category }, req.body)
                    .exec((error, updatedPage) => {
                        if (error) return res.status(400).json({
                            error
                        })
                        if (updatedPage) {
                            return res.status(200).json({
                                page: updatedPage
                            })
                        }
                    })
            } else {
                // If page is new we add it into our database
                const page = new Page(req.body)
                page.save()
                    .then(page => {
                        return res.status(200).json({ page })
                    })
                    .catch(error => {
                        if (error) {
                            return res.status(400).json(error)
                        }
                    })
            }
        }).catch(error => {
            if (error) return res.status(400).json({ error })
        })
}
exports.getPage=(req,res)=>{
    const {categoryId,type} =req.params
   if(type==='page'){
       Page.findOne({category:categoryId}).exec()
       .then(page=>{
            if(page) return res.status(200).json({page})
       }).catch(error=>{
           if(error){
               return res.status(400).json({error})
           }
       })
   }
}

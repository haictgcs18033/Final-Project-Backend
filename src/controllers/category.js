const Category = require('../models/category')
const slugify = require('slugify')
const shortid=require('shortid')
exports.categoryAdd = (req, res) => {
    let { name, parentId } = req.body
    const categoryObj = new Category({
        name: name,
      
        // slug: slugify(name),
        slug: `${slugify(req.body.name)}-${shortid.generate()}`
    })
    if (req.file) {
        // let categoryUrl = process.env.APP_API + '/public/' + req.file.filename
        // Access into file location to get image from aws
        let categoryUrl = req.file.location
        categoryObj.categoryImage = categoryUrl
    }
    if (parentId) {
        categoryObj.parentId = parentId
    }
    const cat = new Category(categoryObj)
    cat.save((err, data) => {
        if (err) {
            return res.status(400).json({
                msg: err
            })
        }
        return res.status(200).json({
            category: data
        })
    })
}
function createCategory(categories, parentId = null) {
    const categoryList = [];
    let category
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }
    for (let cat of category) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            categoryImage: cat.categoryImage,
            parentId: cat.parentId,
            // type:cat.type,
            slug: cat.slug,
            children: createCategory(categories, cat._id)
        })
    }
    return categoryList
}
exports.getCategory = (req, res) => {
    Category.find({})
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    msg: err
                })
            }
            if (categories) {
                const categoryList = createCategory(categories)
                return res.status(200).json({
                    total: categoryList.length,
                    category: categoryList
                })
            }

        })
}
exports.updateCategory = async (req, res) => {
    const { _id, name, parentId} = req.body
    const updatedCategories = []
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                // type: type[i]
            }
            if (parentId[i] !== "") {
                category.parentId = parentId[i]
            }
            const categoryUpdated = await Category.findOneAndUpdate({ _id :_id[i]}, category, { new: true })
            updatedCategories.push(categoryUpdated)
        }
        return res.status(200).json({ updatedCategories })
    } else {
        const category = {
            name,
            // type,
        };
        if (parentId !== "") {
            category.parentId = parentId;
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
            new: true,
        });
        return res.status(201).json({ updatedCategory })
    }
}
exports.deleteCategory= async (req,res)=>{
    const {ids} =req.body
    const deleteCategories=[]
    for(let i=0;i<ids.length;i++){
      const deleteCategory= await Category.findOneAndDelete({_id:ids[i]._id})
      deleteCategories.push(deleteCategory)
    }
   
    if(deleteCategories.length===ids.length){
        res.status(200).json({msg:"Categories removed"})
    }else{
        res.status(400).json({msg:'Something went wrong'})
    }
   
}

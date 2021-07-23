const Category = require('../../models/category');
const Order = require('../../models/order');
const Product = require('../../models/product')
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
            type: cat.type,
            slug: cat.slug,
            children: createCategory(categories, cat._id)
        })
    }
    return categoryList
}
exports.initialDataController = async (req, res) => {
    const categoryItems = await Category.find({}).exec()
    //   select is the chaining function in mongodb .it's responsible for displaying the specific attribute,which we have specified
    // khi muon chon du lieu nao ma ta muon no xuat hien trong ham select ta can khai bao ten thuoc tinh va giua cac thuoc tinh phai co dau cach
    //  populate co tac dung giup ta loc ra nhung du lieu lien quan den collection duoc khai bao trong ham populate 
    const productItems = await Product
        .find({ createdBy: req.user._id })
        .select('_id name price quantity description productPictures category ')
        // .populate('category')
        .populate({ path: 'category', select: '_id name' })
        .exec()
    const orders = await Order.find({}).populate("items.product", "name").exec()
    res.status(200).json({
        categoryItems: createCategory(categoryItems),
        productItems,
        orders
    })
}
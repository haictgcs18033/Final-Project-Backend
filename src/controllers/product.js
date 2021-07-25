const Product = require('../models/product')

const shortid = require('shortid')
const slugify = require('slugify')
const Category = require('../models/category')

exports.getProduct = (req, res) => {
    // res.send('Hello')
    Product.find({})
        .exec((err, product) => {
            if (err) return res.status(400).json({
                msg: err
            })
            if (product) {
                return res.status(200).json(product)
            }
        })
}
exports.getPaginateAllProduct = async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const filterPrice = req.query.filterPrice
    const filterColor = req.query.filterColor
    const filterSize = req.query.filterSize
    const filterRating = parseInt(req.query.filterRating)
    const sortObject = req.query.sortObject
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const result = {}

    if (endIndex < await Product.countDocuments().exec()) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }

    try {
        if (filterPrice && !filterColor && !filterSize && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(price => price.price <= 3)
                    } else if (filterPrice === "under6Dollar") {
                        array = product.filter(price => price.price <= 6 && price.price > 3)
                    }
                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(price => price.price <= 9 && price.price > 6)
                    }
                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(price => price.price <= 12 && price.price > 9)
                    }
                    return result.paginate = array
                })
        }
        if (filterColor && !filterPrice && !filterSize && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter(color => color.color.some((color) => color.includes(filterColor)))
                    return result.paginate = array
                })
        }
        if (filterSize && !filterPrice && !filterColor && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter(size => size.size.some((size) => size.includes(filterSize)))
                    return result.paginate = array
                })
        }
        if (filterRating && !filterPrice && !filterColor && !filterSize) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter(star => star.averageStar === filterRating)
                    return result.paginate = array
                })
        }
        if (filterPrice && filterColor && !filterSize && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(async product => {
                    if (filterPrice === "under3Dollar") {
                        array = await product.filter(object => object.price <= 3 && object.color.some((color) => color.includes(filterColor)))
                    }
                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.color.some((color) => color.includes(filterColor)))
                    }
                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.color.some((color) => color.includes(filterColor)))
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.color.some((color) => color.includes(filterColor)))
                    }
                    return result.paginate = array
                })
        }
        if (filterPrice && filterSize && !filterColor && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.size.some((size) => size.includes(filterSize)))
                    }
                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.size.some((size) => size.includes(filterSize)))
                    }

                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.size.some((size) => size.includes(filterSize)))
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.size.some((size) => size.includes(filterSize)))
                    }

                    return result.paginate = array
                })
        }
        if (filterPrice && filterRating && !filterColor && !filterSize) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.averageStar === filterRating)
                    }

                    return result.paginate = array
                })
        }
        if (filterColor && filterSize && !filterPrice && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter((object) => object.size.some((size) => size.includes(filterSize)) && object.color.some((color) => color.includes(filterColor)))
                    return result.paginate = array
                })
        }
        if (filterColor && filterRating && !filterPrice && !filterColor) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter((object) => object.color.some((size) => size.includes(filterColor)) && object.averageStar === filterRating)
                    return result.paginate = array
                })
        }
        if (filterPrice && filterColor && filterSize && !filterRating) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.color.some((color) => color.includes(filterColor)) && object.size.some((size) => size.includes(filterSize)))
                    }
                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.color.some((color) => color.includes(filterColor)) && object.size.some((size) => size.includes(filterSize)))
                    }

                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.color.some((color) => color.includes(filterColor)) && object.size.some((size) => size.includes(filterSize)))
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.color.some((color) => color.includes(filterColor)) && object.size.some((size) => size.includes(filterSize)))
                    }
                    return result.paginate = array
                })
        }
        if (filterPrice && filterColor && filterRating && !filterSize) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.color.some((color) => color.includes(filterColor)) && object.averageStar === filterRating)
                    }
                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.color.some((color) => color.includes(filterColor)) && object.averageStar === filterRating)
                    }
                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.color.some((color) => color.includes(filterColor)) && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.color.some((color) => color.includes(filterColor)) && object.averageStar === filterRating)
                    }
                    return result.paginate = array
                })
        }
        if (filterPrice && filterSize && filterRating && !filterColor) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating)
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating)
                    }

                    return result.paginate = array
                })
        }
        if (filterColor && filterSize && filterRating && !filterPrice) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    array = product.filter((object) => object.size.some((size) => size.includes(filterSize)) && object.color.some((color) => color.includes(filterColor)) && object.rating === filterRating)
                    return result.paginate = array
                })
        }

        if (filterPrice && filterSize && filterRating && filterColor) {
            let array = []
            await Product.find({})
                .skip(startIndex).limit(limit).exec()
                .then(product => {
                    if (filterPrice === "under3Dollar") {
                        array = product.filter(object => object.price <= 3 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating && object.color.some((color) => color.includes(filterColor)))
                    }

                    else if (filterPrice === "under6Dollar") {
                        array = product.filter(object => object.price <= 6 && object.price > 3 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating && object.color.some((color) => color.includes(filterColor)))
                    }

                    else if (filterPrice === "under9Dollar") {
                        array = product.filter(object => object.price <= 9 && object.price > 6 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating && object.color.some((color) => color.includes(filterColor)))
                    }

                    else if (filterPrice === "under12Dollar") {
                        array = product.filter(object => object.price <= 12 && object.price > 9 && object.size.some((size) => size.includes(filterSize)) && object.averageStar === filterRating && object.color.some((color) => color.includes(filterColor)))
                    }

                    return result.paginate = array
                })
        }

        if (!filterPrice && !filterColor && !filterRating && !filterSize && !sortObject) {
            result.paginate = await Product.find({})
                .skip(startIndex).limit(limit).exec()
        }
        return res.send(result)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: error
        })


    }
}

exports.getAllProductBySlug = async (req, res) => {
    const { slug } = req.params
    Category.findOne({ slug: slug })
        .select('_id name slug ')
        .exec()
        .then(category => {
            if (!category) {
                return res.status(400).json({
                    message: 'No Category Found'
                })
            }
            if (category) {
                Product.find({ category: category._id })
                    .exec()
                    .then(
                        products => {
                            if (products.length === 0) {
                                return res.status(400).json({ message: 'This category does not have any product' })
                            } else {
                                return res.status(200).json(products)
                            }
                        }).catch(error => {
                            return res.status(400).json({ message: err })
                        })
            }
        }
        ).catch(error => {
            console.log(error)
            return res.status(400).json({ message: error })
        })
}
exports.getProductItemBySlug = async (req, res) => {
    const { slug } = req.params
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const sortObject = req.query.sortObject
    let result = {
    }
    Category.findOne({ slug: slug })
        .select('_id name slug ')
        .exec()
        .then(async category => {
            if (!category) {
                return res.status(400).json({
                    msg: 'No Category Found'
                })
            }
            if (category) {
                let countQuery = await Product.where({ category: category._id }).countDocuments().exec();
                if (endIndex < countQuery) {
                    result.next = {
                        page: page + 1,
                        limit: limit
                    }
                }
                else if (startIndex > 0) {
                    result.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (sortObject === 'descending') {
                    await Product.find({ category: category._id })
                        .sort({ name: -1 })
                        .skip(startIndex).limit(limit).exec()
                        .then(products => {
                            if (products.length > 0) {
                                result.paginate = products
                                res.send(result)
                            }
                        }).catch(error => {

                            return res.status(400).json({ error })
                        })

                }
                if (sortObject === 'ascending') {
                    await Product.find({ category: category._id })
                        .sort({ name: 1 })
                        .skip(startIndex).limit(limit).exec()
                        .then(products => {
                            if (products.length > 0) {
                                result.paginate = products
                                res.send(result)
                            }
                        }).catch(error => {

                            return res.status(400).json({ error })
                        })

                }
                else if (sortObject === 'newest') {
                    result.paginate = await Product.find({ category: category._id })
                        .sort({ createdAt: -1 })
                        .skip(startIndex).limit(limit).exec()
                        .then(products => {
                            if (products.length > 0) {
                                result.paginate = products
                                res.send(result)
                            }
                        }).catch(error => {

                            return res.status(400).json({ error })
                        })
                }
                else if (sortObject === 'oldest') {
                    result.paginate = await Product.find({ category: category._id })
                        .sort({ createdAt: 1 })
                        .skip(startIndex).limit(limit).exec()
                        .then(products => {
                            if (products.length > 0) {
                                result.paginate = products
                                res.send(result)
                            }
                        }).catch(error => {

                            return res.status(400).json({ error })
                        })
                }
                if (!sortObject) {
                    await Product.find({ category: category._id })
                        .skip(startIndex).limit(limit)
                        .exec()
                        .then(products => {
                            if (products.length > 0) {
                                result.paginate = products
                                res.send(result)
                            }
                        }).catch(error => {

                            return res.status(400).json({ error })
                        })
                }

            }
        }
        ).catch(error => {
            console.log(error)
            return res.status(400).json({ error })
        })
}
exports.getProductPaginate = async (req, res) => {
    const searchTerm = req.query.searchTerm
    const sortObject = req.query.sortObject
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const result = {}

    if (endIndex < await Product.countDocuments().exec()) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        if (!sortObject) {
            result.paginate = await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .select('_id category name price quantity description productPictures color size')
                // .populate('category')
                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit).exec()
        }
        else if (sortObject === 'descending') {
            result.paginate = await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .sort({ name: -1 })
                .select('_id category name price quantity description productPictures ')
                // .populate('category')
                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit).exec()
        }
        else if (sortObject === 'ascending') {
            result.paginate = await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .sort({ name: 1 })
                .select('_id category name price quantity description productPictures ')
                // .populate('category')
                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit).exec()
        }
        else if (sortObject === 'newest') {
            result.paginate = await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .sort({ createdAt: -1 })
                .select('_id category name price quantity description productPictures ')
                // .populate('category')
                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit).exec()
        }
        else if (sortObject === 'oldest') {
            result.paginate = await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .sort({ createdAt: 1 })
                .select('_id category name price quantity description productPictures ')
                // .populate('category')
                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit).exec()
        } else if (sortObject) {

            await Product.find(
                { name: { $regex: new RegExp(searchTerm, 'i') } }
            )
                .select('_id category name price quantity description productPictures ')

                .populate({ path: 'category', select: '_id name' })
                .skip(startIndex).limit(limit)
                .exec()
                .then(output => {
                    let arraySort = []
                    output.map((item, index) => {
                        if (item.category.name === sortObject) {
                            arraySort.push(item)
                        }
                        return result.paginate = arraySort
                    })
                })
        }
        return res.send(result)
    } catch (error) {
        res.status(400).json({ error })
    }

}

exports.productAdd = (req, res) => {
    const { name, price, quantity, description, category, color, size, averageStar } = req.body

    let colorArray = color.split(",")
    let sizeArray = size.split(",")

    let productPictures = []
    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename }
        })
    }
    const product = new Product({
        name: name,
        slug: slugify(name),
        price: price,
        quantity: quantity,
        description: description,
        productPictures: productPictures,
        color: colorArray,
        averageStar: averageStar,
        size: sizeArray,
        category: category,
        createdBy: req.user._id
    })
    product.save(((err, product) => {
        if (err) {
            console.log(err)
            // return res.status(400).json({
            //     message: 'Product already exists'
            // })
        }
        if (product) {
            res.status(200).json({
                product
            })
        }
    }))

}

exports.getProductDetailById = (req, res) => {
    let { productId } = req.params
    if (productId) {
        Product.findOne({ _id: productId })
            .populate('reviews.user', "firstName lastName profilePicture")
            .exec()
            .then(product => {
                return res.status(200).json({ product })
            })
            .catch(err => {
                return res.status(400).json({
                    err: 'Can not find the product'
                })
            })
    }
}
exports.productUpdate = (req, res) => {
    const { name, price, quantity, description, category ,color,size} = req.body
    let productPictures = []
    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename }
        })
    }
    let colorArray = color.split(",")
    let sizeArray = size.split(",")
    Product.updateOne({ _id: req.body.productId }, {
        $set: {
            name: name,
            slug: slugify(name),
            price: price,
            quantity: quantity,
            description: description,
            productPictures: productPictures,
            category: category,
            color:colorArray,
            size:sizeArray,
            createdBy: req.user._id
        }
    }).exec()
        .then(result => {
            res.status(200).json({ result })
        })
        .catch(err => {
            res.status(400).json({ err })
        })
}
exports.productDelete = (req, res) => {
    Product.deleteOne({ _id: req.body.productId }).exec()
        .then(result => {
            res.status(200).json({ result })
        })
        .catch(err => {
            res.status(400).json({ err })
        })
}

exports.addProductReview = (req, res) => {
    Product.updateOne({ _id: req.body.productId }, {
        $push: {
            reviews: {
                user: req.user._id,
                reviewOfUser: req.body.reviewOfUser,
                starRating: req.body.starRating
            }
        },
        $set: {
            averageStar: req.body.averageStar
        }
    })
        .exec()
        .then(product => {
            return res.status(200).send('Add review successfully')
        })
        .catch(err => {
            return res.status(400).json({
                err: 'Can not find the product'
            })
        })
}


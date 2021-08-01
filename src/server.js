const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
require('dotenv').config()
// Cors
var cors = require('cors')
app.use(cors())
// Connect database
mongoose.connect(process.env.MY_DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false},
    ()=>{
    console.log('Connected to database');
})

// Route
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/admin/adminRoute')
const initialDataRoute=require('./routes/admin/initialData')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')
const cartRoute=require('./routes/cartRoute')
const pageRoute=require('./routes/PageRoute')
const addressRoute=require('./routes/addressRoute')
const orderRoute=require('./routes/orderRoute')
const emailRoute=require('./routes/emailRoute')
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// Upload static file for browser to read

app.use('/public',express.static(path.join(__dirname,'uploads')))
app.use('/user',userRoute)
app.use('/admin',adminRoute)
app.use('/initialData',initialDataRoute)
app.use('/category',categoryRoute)
app.use('/product',productRoute)
app.use('/cart',cartRoute)
app.use('/page',pageRoute)
app.use('/address',addressRoute)
app.use('/order',orderRoute)
app.use('/email',emailRoute)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
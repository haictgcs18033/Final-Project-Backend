const {check,validationResult}=require('express-validator')
exports.validateSignupRequest=[
    check('firstName')
    .notEmpty().withMessage('you need to provide your first name'),
    check('lastName')
    .notEmpty().withMessage('you need to provide your last name'),
    check('email')
    .isEmail().withMessage('Valid email is require'),
    check('password')
    .isLength({min:6}).withMessage('Password must be at least 6 character')
 ] 
 exports.validateSigninRequest=[
    check('email')
    .isEmail().withMessage('Valid email is require'),
    check('password')
    .isLength({min:6}).withMessage('Password must be at least 6 character')
 ] 
 exports.isRequestValidated=(req,res,next)=>{
    const errors = validationResult(req)
    if(errors.array().length>0){
        return res.status(400).json({message:errors.array()[0].msg})
    }
    next()
 }
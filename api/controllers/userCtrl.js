import User from "../model/userModel.js";
import Product from '../model/productModel.js';
import Cart from '../model/cartModel.js';
import Coupon from '../model/couponModel.js'
import Order from '../model/orderModel.js';
import generateToken  from "../config/jwtToken.js";
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";
import generateRefreshToken from "../config/generateRefreshToken.js";
import { jwt } from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
import crypto from "node:crypto";
import uniqid from "uniqid";


export const register = asyncHandler(async (req, res) => {
  try {
    const validate = (data)=> {
      const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("password")
      });
      return schema.validate(data);
    };
    const {error}= validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    
    const email = req.body.email;
    let user = await User.findOne({email});
    if(!user) {
      const newUser = new User(req.body);
      const token = generateToken(newUser._id);
      res.json({newUser, token})
    }else {
      throw new Error("Email already have an account")
    }
  }catch (error){
    console.log(error)
    throw new Error (error)
  };
});


export const login = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.isPasswordMatched(password))) {
      const refreshToken= await generateRefreshToken(user?._id);
      const updateUser = await User.findByIdAndUpdate(
        user?._id, {
        refreshToken: refreshToken,
      }, 
      {new: true});

      res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      })
      
      res.json({
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        mobile: user?.mobile,
        token: generateToken(user?._id)
      })
    } else {
      throw new Error("Invalid Email or Password")
    }
  } catch(error){
    throw new Error(error)
  }
});

export const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
    const admin = await User.findOne({email});
    if(admin.role !== 'admin') throw new Error("Not Authorized")
    if(admin && (await admin.isPasswordMatched(password))) {
      const refreshToken= await generateRefreshToken(admin?._id);
      const updateUser = await User.findByIdAndUpdate(
        admin.id, {
        refreshToken: refreshToken,
      }, 
      {new: true});

      res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      })
      
      res.json({
        _id: admin?._id,
        firstName: admin?.firstName,
        lastName: admin?.lastName,
        email: admin?.email,
        mobile: admin?.mobile,
        token: generateToken(admin?._id)
      })
    } else {
      throw new Error("Invalid Email or Password")
    }
  } catch(error){
    throw new Error(error)
  }
});



export const handleRefreshToken = asyncHandler(async (req, res) => {
  const {refreshToken} = req.cookies;
  if(!refreshToken) throw new Error("Invalid Refresh Token");
  const user = await User.findOne({refreshToken});
  if(!user) throw new Error("Invalid Refresh Token");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if(err || user.id !== decoded.id) throw new Error(err);
    const accessToken = generateToken(user?._id);
    res.json({accessToken});
  });
});

export const logOut = asyncHandler(async (req, res) => {
  const {refreshToken} = req.cookies;
  if(!refreshToken) throw new Error("Invalid Refresh Token");
  const user = await User.findOne({refreshToken});
  if(!user){
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true
    });
    return res.status(204)
  }
  await User.findOneAndUpdate(refreshToken, {refreshToken: ""});
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: true
  });
  res.sendStatus(204)
});


export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch(error){
    throw new Error("Internally Server Error")
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  validMongoDbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
    _id, 
    {
      firstName: req?.body?.firstName, 
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    }, 
    {new: true});
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});


export const saveAddress = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  validMongoDbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
    _id, 
    {
      address: req?.body?.address, 
    }, 
    {new: true});
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});


export const blockUser = asyncHandler(async (req, res) => { 
  const {id} = req.params;
  validMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
    id, 
    {
      isBlocked: true
    }, 
    {new: true})
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});

export const unblockUser = asyncHandler(async (req, res) => { 
  const {id} = req.params;
  validMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false
    }, 
    {new: true})
    res.json(user)
  } catch(error){
    throw new Error(error)
  }
});


export const updatePassword = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  const {password} = req.body;
  validMongoDbId(_id);
  const user = await User.findById(_id);
  if(password){
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword)
  }else{
    res.json(user)
  }
})


export const forgotPasswordToken = asyncHandler(async (req, res) => {
 const {email} = req.body;
 const user = await User.findOne({email})
 if(!user) throw new Error("Invalid Email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `
    Hi, please reset your password. this link is valid for 1 hour.
    <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Me</a>
    `
    const data = {
      email: email,
      text: "Hey User",
      subject: "Forgot Password",
      html: resetURL
    }
    sendEmail(data)
    res.json(token)
  }catch(error){

  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  });
  if(!user) throw new Error("Token has expired");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user)
});



export const getWishlist = asyncHandler(async (req, res) => {
  const {_id} = req.user
  validMongoDbId(_id)
  try{
    const findUser = await User.findById(_id).populate("wishlist");

    res.json(findUser);
  }catch(error){
    throw new Error(error)
  }
});


export const addToCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const{_id} = req.user;
  validMongoDbId(_id);
  try{
    let products = [];
    const user = await User.findById(_id);
    const alreadyExistInCart =  await Cart.findOne({orderby: user._id});
    if(alreadyExistInCart){
      alreadyExistInCart.remove();
    }
    for(let i = 0; i < cart.length; i++){
      let obj = {};
      obj.product = cart[i]._id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      obj.price = getPrice.price;
      products.push(obj);
    }
    let cartTotal = 0;
    for(let i = 0; i < products.length; i++){
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id
    }).save();
    res.json(newCart)
  }catch(error){
    throw new Error(error)
  }
});

export const getUserCart  = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validMongoDbId(_id);
  try{
    const cart = await Cart.findOne({orderby: _id}).populate(
    "products.product");
    res.json(cart)
  }catch(error){
    throw new Error(error)
  }
});


export const emptyCart  = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validMongoDbId(_id);
  try{
    const user = await User.findOne({_id})
    const cart  = await Cart.findOneAndRemove({orderby: user._id});

    res.json(cart)
  }catch(error){
    throw new Error(error)
  }
});


export const applyCoupon = asyncHandler(async(req, res) => {
  const {coupon} = req.body;
  const{_id} = req.user;
  validMongoDbId(_id)
  const validCoupon = await Coupon .findOne({name: coupon})
  if(validCoupon === null){
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({_id});

  let {cartTotal} = await Cart.findOne({
    orderby: user._id
  }).populate("products.product");

  let totalAfterDiscount = (
    cartTotal - (cartTotal * validCoupon.discount)/100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    {orderby: user._id},
    {totalAfterDiscount},
    {new: true}
  )
  res.json(totalAfterDiscount);
});

export const createOrder = asyncHandler(async(req, res) => {
  const { COD, couponApplied} = req.body
  const {_id} = req.user;
  validMongoDbId(_id);
  try{
    if(!COD) throw new Error("Create Cash Order Failed")
    const user = await User.findById(_id);
    const userCart = await Cart.findOne({orderby: user._id });
    let finalAmount = 0;
    if(couponApplied && userCart.totalAfterDiscount){
      finalAmount = userCart.totalAfterDiscount;
    } else {
        finalAmount = userCart.cartTotal;
    }

   await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        createdAt: Date.now(),
        currency: "usd"
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
  }).save();
    let update = userCart.products.map(item => {
      return {
        filter: {_id: item.product._id},
        update:{$inc: {quantity: -item.count, sold: +item.count}}
      }
    });
    await Product.bulkWrite(update, {});
    res.json({message: "success"})
  }catch(error){
    throw new Error(error)
  }
})


export const getOrders = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validMongoDbId(_id);
  try {
    const userorders = await Order.findOne({orderby: _id}).populate("products.product").exec();
    res.json(userorders)
  }catch(error){
    throw new Error(error)
  }
})


export const updateOrderStatus =  asyncHandler(async(req, res) => {
  const {status} = req.body;
  const {id} = req.params;
  validMongoDbId(_id);
  try{
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent:{
          status: status
        }
      },
      {
        new: true
      }
    )
    res.json(updateOrderStatus)
  }catch(error){
    throw new Error(error)
  }
});

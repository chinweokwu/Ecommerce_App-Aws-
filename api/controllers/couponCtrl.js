import Coupon from "../model/couponModel.js";
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";

export const createCoupon = asyncHandler(async (req, res) => {
  try{
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  }catch(err){
    throw new Error(err);
  }
});

export const getCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  }catch(err){
    throw new Error(err);
  }
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try{
    const coupon = await Coupon.findByIdAndUpdate(id, req.body,{new: true});
    res.json(coupon);
  }catch(err){
    throw new Error(err);
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try{
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json(coupon);
  }catch(err){
    throw new Error(err);
  }
});

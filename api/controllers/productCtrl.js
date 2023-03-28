import Product from '../model/productModel.js';
import User from '../model/userModel.js';
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import validMongoDbId from "../utils/validMongoDbId.js";
import { cloudUpload, cloudDelete} from "../utils/cloudinary.js";
import fs from 'fs'

export const createProduct = asyncHandler(async (req, res) => {
  try{
    if(req.body.title){
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  }catch (error){
    throw new Error(error)
  }
})

export const updateProduct = asyncHandler(async(req, res)=>{
  const id = req.params;
  validMongoDbId(id);
  try{
    if(req.body.title){
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({id}, req.body,{
      new: true
    });
    res.json(updateProduct);
  }catch(error){
    throw new Error(error)
  }
})

export const deleteProduct = asyncHandler(async(req, res)=>{
  const id = req.params;
  validMongoDbId(id);
  try{
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  }catch(error){
    throw new Error(error)
  }
})


export const getProduct = asyncHandler(async(req, res) => {
  const {id} = req.params;
  validMongoDbId(id);
  try {
    const findProduct = await Product.findById(id)
    res.json(findProduct)
  }catch(error){
    throw new Error(error)
  }
})

export const getProducts = asyncHandler(async(req,res)=>{
  try{
    //FILTERING
    const queryObj = {...req.query};
    const filterByFields = ["pages","sort","limit", "fields"];
    filterByFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));


    // SORTING
    if(req.query.sort){
      const sortItem = req.query.sort.split(",").join(" ");
      query.sort(sortItem);
    }else {
      query = query.sort("-createdAt") 
    }


    // LIMITING FIELDS
    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields)
    }else {
      query = query.select("-__v")
    }

    // PAGINATION
    const {limit, pages} = req.query;
    const skip = (pages-1) * limit;
    query = query.skip(skip).limit(limit);
    if(pages){
      const count  = await Product.countDocuments();
      if(skip > count) throw new Error("Page does not exists")
    }

    const products = await query;
    res.json(products)

  }catch(error){
    throw new Error(error)
  }
})

export const addWishList = asyncHandler(async(req, res) => {
  const {_id} = req.user
  const {prodId} = req.body
  try {
    const user = await User.findById(_id);
    const existingWish = user.wishlist.find((id) => id.toString() === prodId);
    if(existingWish){
      let user = awaitUser.findByIdAndUpdate(
        _id,
        {
          $pull: {wishlist: prodId},
        },
        {
          new: true,
        }
      )
      res.json(user);
    }else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: {wishlist: prodId},
        },
        {
          new: true,
        }
      )
      res.json(user);
    }
  }catch(error){
    throw new Error(error)
  }
})


export const rating = asyncHandler(async(req,res)=> {
  const {_id} = req.user
  const {star, prodId, comment} = req.body
  try {
    const product  = await Product.findById(prodId);
    let existingRating = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if(existingRating){
      const updateRating = await Product.updateOne(
        {
          ratings: {$elemMatch: existingRating},
        },
        {
          $set: {"ratings.$.star": star, "ratings.$.comment": comment},
        },
        {
          new: true,
        }
      )
    }else{
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      )
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
        .map(item => item.star)
        .reduce((prev, curr) => prev + curr,0);
    let actualRating = Math.round(ratingsum /totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      {
        new: true,
      }
    )
    res.json(finalproduct)
  }catch(error){
    throw new Error(error)
  }
})

export const uploadImages = asyncHandler(async(req, res) =>{

  try{
    const uploader = (path) => cloudUpload(path, "images");
    const urls = [];
    const files = req.files;
    for(const file of files){
      const {path} = file;
      const newpath = await uploader(path);
      urls.push(newpath)
      fs.unlinkSync(path)
    }
    const images = urls.map(file => {
      return file
    })
    res.json(images)
  }catch(error){
    throw new Error(error)
  }
});

export const deleteImages = asyncHandler(async(req, res) =>{
  const {id} = req.params;
  try{
    const deleteImg =  cloudDelete(id, "images");
    res.json({message: "Deleted"})
  }catch(error){
    throw new Error(error)
  }
});



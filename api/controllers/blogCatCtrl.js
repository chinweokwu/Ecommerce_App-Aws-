import BlogCategory from '../model/blogCategoryModel.js';
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCat = await BlogCategory.create(req.body);
    res.json(newCat);
  }catch(error){
    throw new Error(error);
  }
});


export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const cat = await BlogCategory.findByIdAndUpdate(id, req.body,{
      new: true
    });
    res.json(cat);
  }catch(error){
    throw new Error(error);
  }
});

export const getCategories = asyncHandler(async (req, res) => {
  try {
    const cats = await BlogCategory.find();
    res.json(cats);
  }catch(error){
    throw new Error(error);
  }
});

export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const cat = await BlogCategory.findById(id);
    res.json(cat);
  }catch(error){
    throw new Error(error);
  }
});


export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deleteCat = await BlogCategory.findByIdAndDelete(id);
    res.json(deleteCat);
  }catch(error){
    throw new Error(error);
  }
});
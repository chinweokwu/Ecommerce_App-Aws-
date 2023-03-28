import Brand from '../model/brandModel.js';
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";

export const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  }catch(error){
    throw new Error(error);
  }
});


export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body,{
      new: true
    });
    res.json(brand);
  }catch(error){
    throw new Error(error);
  }
});

export const getBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  }catch(error){
    throw new Error(error);
  }
});

export const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    res.json(brand);
  }catch(error){
    throw new Error(error);
  }
});


export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  }catch(error){
    throw new Error(error);
  }
});
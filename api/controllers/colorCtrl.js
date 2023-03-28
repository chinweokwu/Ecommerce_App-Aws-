import Color from '../model/colorModel.js';
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";

export const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  }catch(error){
    throw new Error(error);
  }
});

export const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const color = await Color.findByIdAndUpdate(id, req.body,{
      new: true
    });
    res.json(color);
  }catch(error){
    throw new Error(error);
  }
});

export const getColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  }catch(error){
    throw new Error(error);
  }
});

export const getColor= asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const color = await Color.findById(id);
    res.json(color);
  }catch(error){
    throw new Error(error);
  }
});

export const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const color = await Color.findByIdAndDelete(id);
    res.json(color);
  }catch(error){
    throw new Error(error);
  }
});


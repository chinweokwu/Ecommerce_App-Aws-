import Enquiry from '../model/enqModel.js';
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";

export const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  }catch(error){
    throw new Error(error);
  }
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(id, req.body,{
      new: true
    });
    res.json(enquiry);
  }catch(error){
    throw new Error(error);
  }
});

export const getEnquires = asyncHandler(async (req, res) => {
  try {
    const enquires = await Enquiry.find();
    res.json(enquires);
  }catch(error){
    throw new Error(error);
  }
});

export const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const enquiry = await Enquiry.findById(id);
    res.json(enquiry);
  }catch(error){
    throw new Error(error);
  }
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    res.json(enquiry);
  }catch(error){
    throw new Error(error);
  }
});


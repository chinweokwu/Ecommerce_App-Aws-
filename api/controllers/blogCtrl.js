import Blog from '../model/blogModel.js';
import asyncHandler from "express-async-handler";
import validMongoDbId from "../utils/validMongoDbId.js";
import cloudUpload from "../utils/cloudinary.js";
import fs from 'fs'

export const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await  Blog.create(req.body);
    res.json(newBlog);
  }catch(error){
    throw new Error(error);
  }
});


export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const blog = await  Blog.findByIdAndUpdate(id, req.body,{
      new: true
    });
    res.json(blog);
  }catch(error){
    throw new Error(error);
  }
});

export const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await  Blog.find();
    res.json(blogs);
  }catch(error){
    throw new Error(error);
  }
});

export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const blog = await  Blog.findById(id).populate('likes').populate(dislikes);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: {
          numViews: 1
        }
      },
      {
        new: true
      }
    )
    res.json(blog);
  }catch(error){
    throw new Error(error);
  }
});


export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validMongoDbId(id);
  try {
    const deleteBlog = await  Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  }catch(error){
    throw new Error(error);
  }
});


export const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    const authUserId =  req?.user?._id;
    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes.find(
      (userId => userId?.toString() === authUserId?.toString())
    )
    if(alreadyDisliked){
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: {
            dislikes: authUserId
          },
          isDisliked: false,
        },
        {
          new: true
        }
      );
      res.json(blog);
    }
    if(isLiked){
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: {
            likes: authUserId
          },
          isLiked: false,
        },
        {
          new: true
        }
      );
      res.json(blog);
    }else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: {
            likes: authUserId
          },
          isliked: true,
        },
        {
          new: true
        }
      );
      res.json(blog);
    }

});


export const dislikeBlog = asyncHandler(async (req, res) => {
  const {blogId} = req.body;
  validMongoDbId(blogId);
  const blog = await Blog.findById(blogId);
  const authUserId =  req?.user?._id;
  const isDisLiked = blog?.isDisliked;

  const alreadyliked = blog?.likes.find(
    (userId => userId?.toString() === authUserId?.toString())
  )
  if(alreadyliked){
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          likes: authUserId
        },
        isLiked: false,
      },
      {
        new: true
      }
    );
    res.json(blog);
  }
  if(isDisLiked){
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          dislikes: authUserId
        },
        isDisliked: false,
      },
      {
        new: true
      }
    );
    res.json(blog);
  }else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          dislikes: authUserId
        },
        isDisliked: true,
      },
      {
        new: true
      }
    );
    res.json(blog);
  }

});

export const uploadImages = asyncHandler(async(req, res) =>{
  const {id} = req.params
  validMongoDbId(id)
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
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map(file => {
          return file
        }),
      },
      {
        new: true,
      }
    )
    res.json(findBlog)
  }catch(error){
    throw new Error(error)
  }
});

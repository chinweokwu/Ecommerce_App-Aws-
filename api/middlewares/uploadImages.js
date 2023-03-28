import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from "fs"
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
    {
      message: 'Unsupported file format',
    },
    false
    );
  }
};

export const uploadPhoto = multer({
  storage: multerStorage,
  limits: {
    fileSize: 2000000,
  },
  fileFilter: multerFilter,
});

export const productImgResize = async (req, res, next) => {
  if(!req.files) return next();
  await Promise.all(req.files.map(async (file) => {
    await sharp(file.path)
          .resize(300,300)
          .toFormat("jpeg")
          .jpeg({quality: 90})
          .toFile(`public/images/products/${file.filename}`);
          fs.unlinkSync(`public/images/products/${file.filename}`)

  }));
  next();
};

export const blogImgResize = async (req, res, next) => {
  if(!req.files) return next();
  await Promise.all(req.files.map(async (file) => {
    await sharp(file.path)
          .resize(300,300)
          .toFormat("jpeg")
          .jpeg({quality: 90})
          .toFile(`public/images/blogs/${file.filename}`);
          fs.unlinkSync(`public/images/blogs/${file.filename}`)

  }));
  next();
};






import express from "express";
import {
  createProduct, 
  getProduct, 
  getProducts, 
  updateProduct,
  deleteProduct,
  addWishList,
  rating,
  uploadImages,
  deleteImages
} from "../controllers/productCtrl.js";
import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
import {uploadPhoto, productImgResize} from "../middlewares/uploadImages.js"
const router = express.Router();

router.post("/",authMiddleware,adminAuthMiddleware,createProduct);
router.get("/:id", getProduct);
router.put("/:id",authMiddleware, adminAuthMiddleware, updateProduct)
router.delete("/:id",authMiddleware,adminAuthMiddleware, deleteProduct)
router.get("/", getProducts);
router.put("/wishlist", authMiddleware,  addWishList)
router.put("/rating", authMiddleware,  rating)
router.put(
  "/upload",
  authMiddleware,
  adminAuthMiddleware, 
  uploadPhoto.array("images",10),
  productImgResize,
  uploadImages
)
router.delete('/delete-product-img/:id',authMiddleware, adminAuthMiddleware, deleteImages )

export default router;

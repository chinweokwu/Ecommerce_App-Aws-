import express from "express";
import {
  login,
  register, 
  getUsers, 
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  addToCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus
} from "../controllers/userCtrl.js";
import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/logout', logOut);
router.post('/admin', loginAdmin)
router.post('/forgot-password', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.delete('/delete-user/:id', deleteUser);

router.get('/all-users', getUsers);
router.get('/wishlist',authMiddleware, getWishlist );
router.get('/single-user/:id',authMiddleware, adminAuthMiddleware, getUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/password', authMiddleware, updatePassword);

router.put('/save-address', authMiddleware, saveAddress);
router.post('/cart',authMiddleware, addToCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware,emptyCart);
router.post("/cart/applycoupon",authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.get("/get-orders",authMiddleware, getOrders)
router.put("/order/update-order/:id",authMiddleware, adminAuthMiddleware, updateOrderStatus )

router.put('/block/:id', authMiddleware, adminAuthMiddleware, blockUser);
router.put('/unblock/:id', authMiddleware, adminAuthMiddleware, unblockUser);
router.get('/refresh', handleRefreshToken);

export default router;

import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
  } from "../controllers/couponCtrl.js";
  import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
  
  const router = express.Router();
  
  router.post("/", authMiddleware, adminAuthMiddleware, createCoupon);
  router.put("/:id", authMiddleware, adminAuthMiddleware, updateCoupon);
  router.get("/", authMiddleware, adminAuthMiddleware, getCoupons);
  router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteCoupon);

  export default router;
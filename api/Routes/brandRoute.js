import {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands
  } from "../controllers/brandCtrl.js";
  import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
  
  const router = express.Router();
  
  router.post("/", authMiddleware, adminAuthMiddleware, createBrand);
  router.put("/:id", authMiddleware, adminAuthMiddleware, updateBrand);
  router.get("/:id", getBrand);
  router.get("/", getBrands);
  router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteBrand);

  export default router;
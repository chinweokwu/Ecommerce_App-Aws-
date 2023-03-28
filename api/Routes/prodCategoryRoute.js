import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories
  } from "../controllers/categoryCtrl.js";
  import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
  
  const router = express.Router();
  
  router.post("/", authMiddleware, adminAuthMiddleware, createCategory);
  router.put("/:id", authMiddleware, adminAuthMiddleware, updateCategory);
  router.get("/:id", getCategory);
  router.get("/", getCategories);
  router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteCategory);

  export default router;
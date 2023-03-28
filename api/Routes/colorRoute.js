import {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getColors
  } from "../controllers/colorCtrl.js";
  import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
  
  const router = express.Router();
  
  router.post("/", authMiddleware, adminAuthMiddleware, createColor);
  router.put("/:id", authMiddleware, adminAuthMiddleware, updateColor);
  router.get("/:id", getColor);
  router.get("/", getColors);
  router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteColor);

  export default router;
import {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getEnquires
  } from "../controllers/enqCtrl.js";
  import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
  
  const router = express.Router();
  
  router.post("/", createEnquiry);
  router.put("/:id", authMiddleware, adminAuthMiddleware, updateEnquiry);
  router.get("/:id", getEnquiry);
  router.get("/", getEnquires);
  router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteEnquiry);

  export default router;
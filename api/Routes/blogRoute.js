import {
createBlog,
updateBlog,
getBlog,
getBlogs,
deleteBlog,
likeBlog,
dislikeBlog,
uploadImages
} from "../controllers/blogCtrl.js";
import { authMiddleware,  adminAuthMiddleware } from "../middlewares/authMiddleware.js";
import {uploadPhoto, blogImgResize} from "../middlewares/uploadImages.js"

const router = express.Router();

router.post("/", authMiddleware, adminAuthMiddleware, createBlog);
router.put("/:id", authMiddleware, adminAuthMiddleware, updateBlog);
router.get("/:id", getBlog);
router.get("/", getBlogs);
router.delete("/:id", authMiddleware, adminAuthMiddleware, deleteBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  adminAuthMiddleware, 
  uploadPhoto.array("images",10),
  blogImgResize,
  uploadImages
)

export default router;

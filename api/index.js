import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import userRoutes from "./Routes/userRoute.js";
import productRoutes from "./Routes/productRoute.js";
import blogRoutes from "./Routes/blogRoute.js";
import prodCategoryRoutes from "./Routes/prodCategoryRoute.js";
import blogCategoryRoutes from "./Routes/blogCategoryRoute.js";
import brandRoutes from './Routes/brandRoute.js';
import CouponRoutes from "./Routes/couponRoute.js";
import ColorRoutes from "./Routes/colorRoute.js"
import EnquiryRoutes from "./Routes/enqRoute.js"
import {errorHandler, notFound} from "./middlewares/errorHandler.js";
import CookieParser from "cookie-parser";
import morgan from "morgan";
dotenv.config();

const app = express();
dbConnect();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(CookieParser());

app.use("/api/user",userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/productcategory", prodCategoryRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);
app.use("/api/brand/", brandRoutes);
app.use("/api/coupon", CouponRoutes);
app.use("/api/color", ColorRoutes);
app.use("/api/enquiry", EnquiryRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
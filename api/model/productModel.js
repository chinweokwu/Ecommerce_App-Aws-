import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase:true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
  images: [],
  color: [],
  tags:[],
  ratings: [{
    star:Number,
    comment: String,
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  totalrating: {
    type: String,
    default: 0
  }
},
{timeStamp: true}
);

const Product = mongoose.model("Product", productSchema);

export default Product
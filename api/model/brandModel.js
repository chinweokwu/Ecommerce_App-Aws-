import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
},
{timeStamp: true}
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;

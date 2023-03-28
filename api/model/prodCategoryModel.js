import mongoose from "mongoose";

const prodCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
},
{timeStamp: true}
);

const ProdCategory = mongoose.model("ProdCategory", prodCategorySchema);

export default ProdCategory;
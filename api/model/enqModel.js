import mongoose from "mongoose";

const enqSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,

  },
  mobile: {
    type: String,
    required: true,

  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress"]
  },
},
);


const Enquiry = mongoose.model("Enquiry", enqSchema);

export default Enquiry;


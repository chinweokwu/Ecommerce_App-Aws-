import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  cart: {
    type: Array,
    default: [],
  },
  address: {
    type: String
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  refreshToken: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

},
{
  timestamps: true
}
);

userSchema.pre("save",async (next) => {
  if(!this.isModified("password")){
    return next();
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

userSchema.methods.isPaswordMatched = async (enterPassword) =>{
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour
  return resetToken;
};


const User = mongoose.model("User", userSchema);

export default User


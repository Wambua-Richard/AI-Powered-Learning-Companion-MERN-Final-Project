import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    match: [/.+@.+\..+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: 6,
  },
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (input) {
  return bcrypt.compare(input, this.password);
};

export default mongoose.model("User", userSchema);

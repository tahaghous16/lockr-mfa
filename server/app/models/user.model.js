import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email Required for Creating a User Account"],
      trim: true,
      unique: [true, "Email already exist"],
      lowercase: true,
      trim: true,
      match: [/^.+@.+\..+$/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Name Required for Creating a User Account"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password Required for Creating a User Account"],
      minlength: [6, "Password should be more than 6 character"],
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password
userSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
  } catch (error) {
    return next(error);
  }
});

// Comparing Password with HashPassword
userSchema.methods.isCompared = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

export const userModel = mongoose.model("user", userSchema);

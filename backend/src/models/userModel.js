import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local"; // only require for normal signup
      },
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    uid: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values ,sparse: true ensures MongoDB allows documents without uid.
    },
    profilePicture: {
      type: String,
      default: "", // Default to an empty string if no profile picture is provided
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;

import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUserForSiderbar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request object
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Exclude the logged-in user

    res.status(200).json(filteredUsers); // Send the filtered users as a response
  } catch (error) {
    console.error("Error in getUserForSiderbar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Get the user ID from the request parameters
    const myId = req.user._id; // Get the sender's ID from the authenticated user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages); // Send the messages as a response
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Get the message text and image from the request body
    const { id: receiverId } = req.params; // Get the receiver's ID from the request parameters
    const senderId = req.user._id; // Get the sender's ID from the authenticated

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image; provided by cloudinary
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Use the uploaded image URL
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage); // Send the newly created message as a response
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "make sure you connected to the internet" });
  }
};

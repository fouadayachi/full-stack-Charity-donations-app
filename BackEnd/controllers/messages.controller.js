import Messages from "../models/messagesModel.js";

export const sendMessage = async (req, res) => {
  const { fullName, email, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newMessage = new Messages({
      fullName,
      email,
      message,
    });
    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Messages.find({});
    if (!messages)
      return res.status(404).json({ message: "No messages found" });
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleReadStatus = async (req, res) => {
  const { messageId } = req.params;
  const { isRead } = req.body;

  try {
    const updatedMessage = await Messages.findByIdAndUpdate(
      messageId,
      { isRead },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// messages.controller.js
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await Messages.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Message = require("../models/message.model");

async function sendMessageController(req, res) {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.log("Send Message Error:", err);
    res.status(500).json({ message: "Error sending message" });
  }
}

async function getMessagesController(req, res) {
  try {
    const currentUser = req.user.id;
    const otherUser = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: otherUser },
        { sender: otherUser, receiver: currentUser },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.log("Get Messages Error:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
}

module.exports = {
  sendMessageController,
  getMessagesController,
};
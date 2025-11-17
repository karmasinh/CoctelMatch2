const express = require("express");
const { ChatModel } = require("../models/Chat.model");
const chatRouter = express.Router();

// Router to create chat between
chatRouter.post("/addmessage", async (req, res) => {
  try {
    const payload = req.body || {};
    const newChat = new ChatModel({
      sender: payload.sender,
      receiver: payload.receiver,
      message: payload.message || "",
      type: payload.type || "text",
      attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
      time: payload.time,
    });
    await newChat.save();
    res.status(200).send({ message: "Mensaje enviado" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

chatRouter.get("/getmessage/:firstId/:secondId", async (req, res) => {
  const firstId = req.params.firstId;
  const secondId = req.params.secondId;

  try {
    const chat = await ChatModel.find({
        $or: [
          { sender: firstId, receiver: secondId },
          { sender: secondId, receiver: firstId },
        ],
      });

    res.status(200).send(chat);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = chatRouter;

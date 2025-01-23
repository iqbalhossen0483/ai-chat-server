const Chat = require("../models/Chats");
const { AskAiStudio } = require("../services/aiStudio");
const catchAsync = require("../ulits/catchAsync");

//chat with ai;
const chat = catchAsync(async (req, res) => {
  const { userId, message } = req.body;

  //set headers for straming;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await AskAiStudio(message);

  let response = "";
  for await (const chunk of stream.stream) {
    const text = chunk.text();
    response += text;
    res.write(text);
  }

  const data1 = await Chat.create({
    userId: userId,
    role: "user",
    message: message,
  });
  const data2 = await Chat.create({
    userId: userId,
    role: "assistant",
    message: response,
  });
  console.log({ data1, data2 });
  res.end();
});

// get chats with user id;
const getChat = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return next({ message: "User id is required" });
  const chats = await Chat.find({ userId });
  res.json({ success: true, data: chats });
});

module.exports = {
  getChat,
  chat,
};

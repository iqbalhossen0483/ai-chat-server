const express = require("express");
const { getChat, chat } = require("../controllers/chat");
const router = express.Router();

router.get("/:userId", getChat);
router.post("/", chat);

module.exports = router;

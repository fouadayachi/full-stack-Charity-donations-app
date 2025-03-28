import express from 'express';
import { deleteMessage, getMessages, getUnreadMessagesCount, sendMessage, toggleReadStatus } from '../controllers/messages.controller.js';


const messagesRouter = express.Router();

messagesRouter.post("/sendMessage",sendMessage);
messagesRouter.get("/getMessages",getMessages);
messagesRouter.get("/getUnreadMessagesCount", getUnreadMessagesCount);
messagesRouter.put("/toggleReadStatus/:messageId", toggleReadStatus);
messagesRouter.delete("/deleteMessage/:messageId", deleteMessage);

export default messagesRouter;
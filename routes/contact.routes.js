import { Router } from "express";

import {
  sendMessage,
  getAllMessages,
} from "../controllers/contact.controllers.js";

import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/send_message", sendMessage);
router.get("/get_all_messages", isAuthenticated, getAllMessages);

export default router;

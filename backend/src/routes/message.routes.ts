import express from "express";

import {
  sendMessage,
  getMessagesByTicket,
} from "../controllers/message.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  protect,
  sendMessage
);

router.get(
  "/:ticketId",
  protect,
  getMessagesByTicket
);

export default router;
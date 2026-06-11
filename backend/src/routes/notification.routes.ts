import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", protect, getNotifications);

router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);

export default router;
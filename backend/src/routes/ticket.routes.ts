import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  escalateTicket,
  resolveTicket,
  assignTicket,
} from "../controllers/ticket.controller";

import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", protect, createTicket);

router.get("/", protect, getTickets);

router.get("/:id", protect, getTicketById);

router.patch(
  "/:id/escalate",
  protect,
  authorize("employee"),
  escalateTicket
);

router.patch(
  "/:id/resolve",
  protect,
  authorize("agent", "admin"),
  resolveTicket
);

router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignTicket
);

export default router;
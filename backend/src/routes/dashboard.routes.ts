import express from "express";

import {
  getEmployeeDashboard,
  getAgentDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller";

import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.get(
  "/employee",
  protect,
  authorize("employee"),
  getEmployeeDashboard
);

router.get(
  "/agent",
  protect,
  authorize("agent"),
  getAgentDashboard
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAdminDashboard
);

export default router;
import express from "express";

import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  employeeRoute,
  agentRoute,
  adminRoute,
} from "../controllers/test.controller";

const router = express.Router();

router.get(
  "/employee",
  protect,
  authorize("employee", "agent", "admin"),
  employeeRoute
);

router.get(
  "/agent",
  protect,
  authorize("agent", "admin"),
  agentRoute
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  adminRoute
);

export default router;
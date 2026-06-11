import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  createArticleFromTicket,
} from "../controllers/knowledge.controller";

import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createArticle
);

router.get(
  "/",
  protect,
  getArticles
);

router.post(
  "/from-ticket/:ticketId",
  protect,
  authorize("admin", "agent"),
  createArticleFromTicket
);

router.get(
  "/:id",
  protect,
  getArticleById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateArticle
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteArticle
);

export default router;
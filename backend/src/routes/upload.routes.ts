import express from "express";
import { uploadImage } from "../controllers/upload.controller";
import upload from "../middleware/upload.middleware";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  uploadImage
);

export default router;
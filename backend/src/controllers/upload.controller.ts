import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
  return res.status(400).json({
    success: false,
    message: "No image uploaded",
  });
}

const file = req.file;

const streamUpload = () => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resolveai-tickets",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

    const result = await streamUpload();

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
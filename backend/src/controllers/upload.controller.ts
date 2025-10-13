import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import fileUploadService from "../services/file-upload.service";
import multer from "multer";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
    }
  },
});

export const uploadImage = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No image file provided");
      }

      // Validate the file
      fileUploadService.validateImageFile(req.file);

      // Upload to S3
      const imageUrl = await fileUploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        "posts"
      );

      res.status(httpStatus.OK).json({
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
          filename: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Failed to upload image",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  },
];

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Image URL is required");
    }

    await fileUploadService.deleteFile(imageUrl);

    res.status(httpStatus.OK).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to delete image",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

export default {
  uploadImage,
  deleteImage,
};
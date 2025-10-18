import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";
import multer from "multer";
import { Request } from "express";

// Configure multer for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type '${file.mimetype}'. Only JPEG, PNG, GIF, and WebP images are allowed.`
        )
      );
    }
  },
});

class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || "campaign-management";

    this.s3Client = new S3Client({
      region: process.env.S3_REGION || "default",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true, // Required for some S3-compatible services like Contabo
    });
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = "uploads",
    bucket?: string
  ): Promise<string> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(fileName);
      const uniqueName = `${Date.now()}-${crypto.randomBytes(16).toString("hex")}${fileExtension}`;
      const key = `${folder}/${uniqueName}`;
      const targetBucket = bucket || this.bucketName;

      const command = new PutObjectCommand({
        Bucket: targetBucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: "public-read", // Make files publicly accessible
      });

      await this.s3Client.send(command);

      // Return the public URL
      const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${process.env.S3_TENANT_ID}:${targetBucket}/${key}`;
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file");
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const urlParts = fileUrl.split(`/${this.bucketName}/`);
      if (urlParts.length !== 2) {
        throw new Error("Invalid file URL");
      }
      const key = urlParts[1];

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file");
    }
  }

  /**
   * Upload base64 image to S3
   */
  async uploadBase64Image(
    base64Data: string,
    fileName: string,
    folder: string = "uploads",
    bucket?: string
  ): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

      // Convert base64 to buffer
      const buffer = Buffer.from(base64, "base64");

      // Validate size (5MB limit)
      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error("File too large. Maximum size is 5MB.");
      }

      // Determine mime type from base64 prefix
      let mimeType = "image/jpeg"; // default
      if (base64Data.startsWith("data:image/png")) {
        mimeType = "image/png";
      } else if (base64Data.startsWith("data:image/gif")) {
        mimeType = "image/gif";
      } else if (base64Data.startsWith("data:image/webp")) {
        mimeType = "image/webp";
      }

      return this.uploadFile(buffer, fileName, mimeType, folder, bucket);
    } catch (error) {
      console.error("Error uploading base64 image:", error);
      throw new Error("Failed to upload image");
    }
  }

  /**
   * Validate file type and size
   */
  validateImageFile(file: Express.Multer.File): void {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
      );
    }

    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size is 5MB.");
    }
  }
  async processImageUpload(
    req: Request,
    imageData?: string,
    folder: string = "uploads"
  ): Promise<string | undefined> {
    // Handle multer file upload
    if (req.file) {
      const file = req.file as Express.Multer.File;
      this.validateImageFile(file);
      return await this.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        folder
      );
    }

    if (imageData) {
      if (imageData.startsWith("http://") || imageData.startsWith("https://")) {
        return imageData; // Use URL as-is
      }

      if (imageData.startsWith("data:image/")) {
        return await this.uploadBase64Image(imageData, "image.jpg", folder);
      }
      throw new Error(
        "Invalid image format. Please provide a valid URL, base64 data, or upload an image file."
      );
    }
    return undefined; // No image provided
  }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;

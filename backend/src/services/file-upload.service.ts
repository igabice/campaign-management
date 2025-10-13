import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";

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
    folder: string = "uploads"
  ): Promise<string> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(fileName);
      const uniqueName = `${Date.now()}-${crypto.randomBytes(16).toString("hex")}${fileExtension}`;
      const key = `${folder}/${uniqueName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: "public-read", // Make files publicly accessible
      });

      await this.s3Client.send(command);

      // Return the public URL
      const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${process.env.S3_TENANT_ID}:${this.bucketName}/${key}`;
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
}

const fileUploadService = new FileUploadService();
export default fileUploadService;

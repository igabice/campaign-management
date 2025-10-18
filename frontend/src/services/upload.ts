import { post } from "../lib/http";

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string; size: number; mimeType: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await post("/upload/image", formData);

    return response.data;
  },
};
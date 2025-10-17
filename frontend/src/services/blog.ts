import http, { getPaginated } from '../lib/http';
import { Blog } from '../types/schemas';

export const blogService = {
  async getBlogs(params?: { published?: boolean; page?: number; limit?: number }) {
    const response = await getPaginated<Blog>('/blogs', { params });
    return response.data;
  },

  async getBlog(id: string) {
    const response = await http.get(`/blogs/${id}`);
    return response.data;
  },

  async getBlogBySlug(slug: string) {
    const response = await http.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  async createBlog(data: { title: string; content: string; slug: string; tags?: string[]; published?: boolean }) {
    const response = await http.post('/blogs', data);
    return response.data;
  },

  async updateBlog(id: string, data: Partial<{ title: string; content: string; slug: string; tags: string[]; published: boolean }>) {
    const response = await http.patch(`/blogs/${id}`, data);
    return response.data;
  },

  async deleteBlog(id: string) {
    await http.delete(`/blogs/${id}`);
  },
};
import { get, getPaginated, post, put, del } from "../lib/http";
import { Article } from "../types/schemas";
import { PaginatedResponse } from "../types/commons";

export type { Article };

export interface CreateArticleInput {
  title: string;
  body: string;
  hook?: string;
  callToAction?: string;
  onScreenText?: string;
  topic: string;
}

export interface UpdateArticleInput {
  title?: string;
  body?: string;
  hook?: string;
  callToAction?: string;
  onScreenText?: string;
  topic?: string;
}

export type ArticlesResponse = PaginatedResponse<Article>;

export const articlesService = {
  async getArticles(page = 1, limit = 10): Promise<ArticlesResponse> {
    const response = await getPaginated<Article>(`/articles?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getArticle(id: string): Promise<Article> {
    const response = await get(`/articles/${id}`);
    return response.data;
  },

  async createArticle(article: CreateArticleInput): Promise<Article> {
    const response = await post("/articles", article);
    return response.data;
  },

  async updateArticle(id: string, article: UpdateArticleInput): Promise<Article> {
    const response = await put(`/articles/${id}`, article);
    return response.data;
  },

  async deleteArticle(id: string): Promise<void> {
    await del(`/articles/${id}`);
  },
};
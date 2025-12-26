import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";

export interface CreateArticleInput {
  title: string;
  body: string;
  hook?: string;
  callToAction?: string;
  onScreenText?: string;
  topic: string;
  userId: string;
}

export interface UpdateArticleInput {
  title?: string;
  body?: string;
  hook?: string;
  callToAction?: string;
  onScreenText?: string;
  topic?: string;
}

async function createArticle(articleBody: CreateArticleInput) {
  return prisma.article.create({
    data: articleBody,
  });
}

async function queryArticles(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.article.paginate(
    {
      ...(!!filter && { where: filter }),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: "desc" },
    },
    { limit, page }
  );
}

async function getArticleById(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
  }

  return article;
}

async function updateArticleById(
  articleId: string,
  updateBody: UpdateArticleInput
) {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
  }

  return prisma.article.update({
    where: { id: articleId },
    data: updateBody,
  });
}

async function deleteArticleById(articleId: string) {
  const article = await getArticleById(articleId);

  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
  }

  return prisma.article.delete({
    where: { id: articleId },
  });
}

export default {
  createArticle,
  queryArticles,
  getArticleById,
  updateArticleById,
  deleteArticleById,
};

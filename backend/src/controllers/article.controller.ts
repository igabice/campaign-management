import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import articleService from "../services/article.service";

const createArticle = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const articleBody = { ...req.body, userId: session.user.id };

  const article = await articleService.createArticle(articleBody);
  res.status(httpStatus.CREATED).send(article);
});

const getArticles = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const filter = {
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.topic && { topic: req.query.topic }),
  };

  const articles = await articleService.queryArticles(filter, options);
  res.send(articles);
});

const getArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const article = await articleService.getArticleById(articleId);
  res.send(article);
});

const updateArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const updateBody = req.body;

  const article = await articleService.updateArticleById(articleId, updateBody);
  res.send(article);
});

const deleteArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;

  await articleService.deleteArticleById(articleId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
};

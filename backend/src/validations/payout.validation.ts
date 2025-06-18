import Joi from "joi";

const createPayout = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    amount: Joi.number().required(),
    campaignId: Joi.string().required(),
  }),
};

const getPayouts = {
    params: Joi.object().keys({
    id: Joi.string(),
  }),
  query: Joi.object().keys({
    searchTerm: Joi.number(),
  }),
};

const updatePayout = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
    body: Joi.object().keys({
    country: Joi.string(),
    amount: Joi.number(),
  }),
};

const deletePayout = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export default {
  createPayout,
  getPayouts,
  updatePayout,
  deletePayout
};

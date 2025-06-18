import Joi from "joi";

const body = Joi.object().keys({
  title: Joi.string().required(),
  landingPageUrl: Joi.string().required(),
  isRunning: Joi.boolean(),
});

const createCampaign = {
  body,
};

const getCampaigns = {
  query: Joi.object().keys({
    searchTerm: Joi.string(),
    isRunning: Joi.bool(),
    sortBy: Joi.string().allow(null).empty(""),
    sortType: Joi.string().allow(null).empty(""),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCampaign = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
    query: Joi.object().keys({
    searchTerm: Joi.string(),
    sortBy: Joi.string().allow(null).empty(""),
    sortType: Joi.string().allow(null).empty(""),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateCampaign = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
  body: {
    title: Joi.string(),
    landingPageUrl: Joi.string(),
    isRunning: Joi.boolean(),
  },
};

const deleteCampaign = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export default {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};

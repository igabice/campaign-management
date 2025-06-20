import Joi from "joi";


const body = Joi.object({
  title: Joi.string().required(),
  landingPageUrl: Joi.string().uri().required().min(1),
  isRunning: Joi.boolean(),
  payouts: Joi.array().items({country: Joi.string().required(),
      amount: Joi.number().required()}).min(0)
    .unique('country')
  .messages({ 
      'array.unique': 'Each payout must have a unique country. Duplicate country found: "{{#value}}".'
    }),
});

const createCampaign = {
  body,
};

const getCampaigns = {
  query: Joi.object({
    searchTerm: Joi.string().allow(null).empty(""),
    isRunning: Joi.bool(),
    sortBy: Joi.string().allow(null).empty(""),
    sortType: Joi.string().allow(null).empty(""),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCampaign = {
  params: Joi.object({
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
  params: Joi.object({
    id: Joi.string(),
  }),
  body: {
    title: Joi.string(),
    landingPageUrl: Joi.string(),
    isRunning: Joi.boolean(),
  },
};

const deleteCampaign = {
  params: Joi.object({
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

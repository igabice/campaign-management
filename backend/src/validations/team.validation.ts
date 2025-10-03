import Joi from "joi";

const createTeam = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
};

const getTeams = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTeam = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const updateTeam = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const deleteTeam = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

export default {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};
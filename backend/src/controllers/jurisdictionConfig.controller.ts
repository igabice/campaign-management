import httpStatus from 'http-status';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError';
import jurisdictionConfigService from '../services/jurisdictionConfig.service';

const createJurisdictionConfig = asyncHandler(async (req, res) => {
  const jurisdictionConfig = await jurisdictionConfigService.createJurisdictionConfig(req.body);
  res.status(httpStatus.CREATED).send(jurisdictionConfig);
});

const getJurisdictionConfigs = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as 'asc' | 'desc',
  };

  const filter = {};

  const jurisdictionConfigs = await jurisdictionConfigService.queryJurisdictionConfigs(filter, options);
  res.send(jurisdictionConfigs);
});

const getJurisdictionConfig = asyncHandler(async (req, res) => {
  const jurisdictionConfigId = req.params.id;
  const jurisdictionConfig = await jurisdictionConfigService.getJurisdictionConfigById(jurisdictionConfigId);

  if (!jurisdictionConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'JurisdictionConfig not found');
  }

  res.send(jurisdictionConfig);
});

const updateJurisdictionConfig = asyncHandler(async (req, res) => {
  const jurisdictionConfigId = req.params.id;
  const updateBody = { ...req.body };

  const jurisdictionConfig = await jurisdictionConfigService.updateJurisdictionConfigById(
    jurisdictionConfigId,
    updateBody
  );
  res.send(jurisdictionConfig);
});

const deleteJurisdictionConfig = asyncHandler(async (req, res) => {
  const jurisdictionConfigId = req.params.id;
  await jurisdictionConfigService.deleteJurisdictionConfigById(jurisdictionConfigId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createJurisdictionConfig,
  getJurisdictionConfigs,
  getJurisdictionConfig,
  updateJurisdictionConfig,
  deleteJurisdictionConfig,
};

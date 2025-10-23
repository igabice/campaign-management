import httpStatus from 'http-status';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError';
import contractService from '../services/contract.service';

const createContract = asyncHandler(async (req, res) => {
  const contract = await contractService.createContract(req.body);
  res.status(httpStatus.CREATED).send(contract);
});

const getContracts = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as 'asc' | 'desc',
  };

  const filter = {};

  const contracts = await contractService.queryContracts(filter, options);
  res.send(contracts);
});

const getContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const contract = await contractService.getContractById(contractId);

  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }

  res.send(contract);
});

const updateContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const updateBody = { ...req.body };

  const contract = await contractService.updateContractById(
    contractId,
    updateBody
  );
  res.send(contract);
});

const deleteContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  await contractService.deleteContractById(contractId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract,
};

import httpStatus from 'http-status';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError';
import vendorDocumentService from '../services/vendorDocument.service';

const createVendorDocument = asyncHandler(async (req, res) => {
  const vendorDocument = await vendorDocumentService.createVendorDocument(req.body);
  res.status(httpStatus.CREATED).send(vendorDocument);
});

const getVendorDocuments = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as 'asc' | 'desc',
  };

  const filter = {};

  const vendorDocuments = await vendorDocumentService.queryVendorDocuments(filter, options);
  res.send(vendorDocuments);
});

const getVendorDocument = asyncHandler(async (req, res) => {
  const vendorDocumentId = req.params.id;
  const vendorDocument = await vendorDocumentService.getVendorDocumentById(vendorDocumentId);

  if (!vendorDocument) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VendorDocument not found');
  }

  res.send(vendorDocument);
});

const updateVendorDocument = asyncHandler(async (req, res) => {
  const vendorDocumentId = req.params.id;
  const updateBody = { ...req.body };

  const vendorDocument = await vendorDocumentService.updateVendorDocumentById(
    vendorDocumentId,
    updateBody
  );
  res.send(vendorDocument);
});

const deleteVendorDocument = asyncHandler(async (req, res) => {
  const vendorDocumentId = req.params.id;
  await vendorDocumentService.deleteVendorDocumentById(vendorDocumentId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createVendorDocument,
  getVendorDocuments,
  getVendorDocument,
  updateVendorDocument,
  deleteVendorDocument,
};

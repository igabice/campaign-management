import httpStatus from 'http-status';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError';
import vendorService from '../services/vendor.service';

const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(httpStatus.CREATED).send(vendor);
});

const getVendors = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as 'asc' | 'desc',
  };

  const filter = {};

  const vendors = await vendorService.queryVendors(filter, options);
  res.send(vendors);
});

const getVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  const vendor = await vendorService.getVendorById(vendorId);

  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  res.send(vendor);
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  const updateBody = { ...req.body };

  const vendor = await vendorService.updateVendorById(
    vendorId,
    updateBody
  );
  res.send(vendor);
});

const deleteVendor = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;
  await vendorService.deleteVendorById(vendorId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
};

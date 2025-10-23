import { Vendor } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import prisma from '../config/prisma';

async function createVendor(vendorBody: {
  companyName: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
  address?: string;
  website?: string;
  primaryContactEmail?: string;
  serviceDescription: string;
  dataProcessingRole: string;
  businessUnitOwner: string;
  organizationId: string;
}): Promise<Vendor> {
  return prisma.vendor.create({
    data: vendorBody,
  });
}

async function queryVendors(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.vendor.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: 'desc' },
    },
    { limit, page }
  );
}

async function getVendorById(id: string): Promise<Vendor | null> {
  return prisma.vendor.findFirst({
    where: { id },
  });
}

async function updateVendorById(
  id: string,
  updateBody: {
    companyName?: string;
    primaryContactName?: string;
    primaryContactPhone?: string;
    address?: string;
    website?: string;
    primaryContactEmail?: string;
    serviceDescription?: string;
    dataProcessingRole?: string;
    businessUnitOwner?: string;
    organizationId?: string;
  }
): Promise<Vendor> {
  const vendor = await getVendorById(id);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  return prisma.vendor.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteVendorById(id: string): Promise<Vendor> {
  const vendor = await getVendorById(id);
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  return prisma.vendor.delete({ where: { id } });
}

export default {
  createVendor,
  queryVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
};

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

async function getVendorDashboardData(organizationId: string) {
  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(now.getDate() + 30);
  const in90Days = new Date();
  in90Days.setDate(now.getDate() + 90);

  const [
    totalVendors,
    vendorsWithDpa,
    highRiskVendors,
    vendorsPerRiskLevel,
    expiredContracts,
    expiringIn30DaysContracts,
    expiringIn90DaysContracts,
  ] = await prisma.$transaction([
    prisma.vendor.count({ where: { organizationId } }),
    prisma.vendor.count({
      where: {
        organizationId,
        documents: { some: { documentType: 'DPA' } },
      },
    }),
    prisma.vendor.count({
      where: { organizationId, riskLevel: 'High' },
    }),
    prisma.vendor.groupBy({
      by: ['riskLevel'],
      _count: { _all: true },
      where: { organizationId },
    }),
    prisma.contract.count({
      where: { organizationId, expiryDate: { lt: now } },
    }),
    prisma.contract.count({
      where: {
        organizationId,
        expiryDate: { gte: now, lte: in30Days },
      },
    }),
    prisma.contract.count({
      where: {
        organizationId,
        expiryDate: { gt: in30Days, lte: in90Days },
      },
    }),
  ]);

  const formattedRiskLevels = vendorsPerRiskLevel.map((item) => ({
    level: item.riskLevel || 'Not Set',
    count: item._count._all,
  }));

  return {
    totalVendors,
    vendorsWithDpa,
    highRiskVendors,
    overdueRenewals: expiredContracts,
    vendorIncidentsLast90Days: 0,
    vendorsPerRiskLevel: formattedRiskLevels,
    contractsPerExpiry: [
      { label: 'Expired', count: expiredContracts },
      { label: 'Expires in 30 Days', count: expiringIn30DaysContracts },
      { label: 'Expires in 90 Days', count: expiringIn90DaysContracts },
    ],
  };
}

export default {
  createVendor,
  queryVendors,
  getVendorById,
  updateVendorById,
  deleteVendorById,
  getVendorDashboardData,
};

import { JurisdictionConfig } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import prisma from '../config/prisma';

async function createJurisdictionConfig(jurisdictionConfigBody: {
  country: string;
  fileName: string;
  filePath: string;
  requiresDueDiligence?: boolean;
  dueDiligenceRequirements?: string;
  defaultDPATemplate?: string;
  otherNotes?: string;
  vendorId: string;
}): Promise<JurisdictionConfig> {
  return prisma.jurisdictionConfig.create({
    data: jurisdictionConfigBody,
  });
}

async function queryJurisdictionConfigs(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.jurisdictionConfig.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: 'desc' },
    },
    { limit, page }
  );
}

async function getJurisdictionConfigById(id: string): Promise<JurisdictionConfig | null> {
  return prisma.jurisdictionConfig.findFirst({
    where: { id },
  });
}

async function updateJurisdictionConfigById(
  id: string,
  updateBody: {
    country?: string;
    fileName?: string;
    filePath?: string;
    requiresDueDiligence?: boolean;
    dueDiligenceRequirements?: string;
    defaultDPATemplate?: string;
    otherNotes?: string;
    vendorId?: string;
  }
): Promise<JurisdictionConfig> {
  const jurisdictionConfig = await getJurisdictionConfigById(id);
  if (!jurisdictionConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'JurisdictionConfig not found');
  }

  return prisma.jurisdictionConfig.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteJurisdictionConfigById(id: string): Promise<JurisdictionConfig> {
  const jurisdictionConfig = await getJurisdictionConfigById(id);
  if (!jurisdictionConfig) {
    throw new ApiError(httpStatus.NOT_FOUND, 'JurisdictionConfig not found');
  }

  return prisma.jurisdictionConfig.delete({ where: { id } });
}

export default {
  createJurisdictionConfig,
  queryJurisdictionConfigs,
  getJurisdictionConfigById,
  updateJurisdictionConfigById,
  deleteJurisdictionConfigById,
};

import { Contract } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import prisma from '../config/prisma';

async function createContract(contractBody: {
  title: string;
  contractType: string;
  status?: string;
  expiryDate?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  vendorId: string;
  organizationId: string;
}): Promise<Contract> {
  return prisma.contract.create({
    data: contractBody,
  });
}

async function queryContracts(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.contract.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: 'desc' },
    },
    { limit, page }
  );
}

async function getContractById(id: string): Promise<Contract | null> {
  return prisma.contract.findFirst({
    where: { id },
  });
}

async function updateContractById(
  id: string,
  updateBody: {
    title?: string;
    contractType?: string;
    status?: string;
    expiryDate?: string;
    fileName?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    description?: string;
    vendorId?: string;
    organizationId?: string;
  }
): Promise<Contract> {
  const contract = await getContractById(id);
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }

  return prisma.contract.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteContractById(id: string): Promise<Contract> {
  const contract = await getContractById(id);
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract not found');
  }

  return prisma.contract.delete({ where: { id } });
}

export default {
  createContract,
  queryContracts,
  getContractById,
  updateContractById,
  deleteContractById,
};

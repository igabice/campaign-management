import { VendorDocument } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import prisma from '../config/prisma';

async function createVendorDocument(vendorDocumentBody: {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  version?: string;
  description?: string;
  vendorId?: string;
}): Promise<VendorDocument> {
  return prisma.vendorDocument.create({
    data: vendorDocumentBody,
  });
}

async function queryVendorDocuments(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.vendorDocument.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : { uploadedAt: 'desc' },
    },
    { limit, page }
  );
}

async function getVendorDocumentById(id: string): Promise<VendorDocument | null> {
  return prisma.vendorDocument.findFirst({
    where: { id },
  });
}

async function updateVendorDocumentById(
  id: string,
  updateBody: {
    fileName?: string;
    filePath?: string;
    fileSize?: number;
    mimeType?: string;
    documentType?: string;
    version?: string;
    description?: string;
    vendorId?: string;
  }
): Promise<VendorDocument> {
  const vendorDocument = await getVendorDocumentById(id);
  if (!vendorDocument) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VendorDocument not found');
  }

  return prisma.vendorDocument.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteVendorDocumentById(id: string): Promise<VendorDocument> {
  const vendorDocument = await getVendorDocumentById(id);
  if (!vendorDocument) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VendorDocument not found');
  }

  return prisma.vendorDocument.delete({ where: { id } });
}

export default {
  createVendorDocument,
  queryVendorDocuments,
  getVendorDocumentById,
  updateVendorDocumentById,
  deleteVendorDocumentById,
};

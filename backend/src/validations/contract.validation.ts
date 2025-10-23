import { z } from 'zod';

const createContract = z.object({
  body: z.object({
    title: z.string(),
    contractType: z.string(),
    status: z.string().optional(),
    expiryDate: z.string().optional(),
    fileName: z.string(),
    filePath: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    description: z.string().optional(),
    vendorId: z.string(),
    organizationId: z.string(),
  }),
});

const getContracts = z.object({
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sortType: z.enum(['asc', 'desc']).optional(),
  }),
});

const getContract = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const updateContract = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    contractType: z.string().optional(),
    status: z.string().optional(),
    expiryDate: z.string().optional(),
    fileName: z.string().optional(),
    filePath: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    description: z.string().optional(),
    vendorId: z.string().optional(),
    organizationId: z.string().optional(),
  }),
});

const deleteContract = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract,
};

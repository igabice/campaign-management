import { z } from 'zod';

const createVendorDocument = z.object({
  body: z.object({
    fileName: z.string(),
    filePath: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    documentType: z.string(),
    version: z.string().optional(),
    description: z.string().optional(),
    vendorId: z.string().optional(),
  }),
});

const getVendorDocuments = z.object({
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sortType: z.enum(['asc', 'desc']).optional(),
  }),
});

const getVendorDocument = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const updateVendorDocument = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    fileName: z.string().optional(),
    filePath: z.string().optional(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    documentType: z.string().optional(),
    version: z.string().optional(),
    description: z.string().optional(),
    vendorId: z.string().optional(),
  }),
});

const deleteVendorDocument = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default {
  createVendorDocument,
  getVendorDocuments,
  getVendorDocument,
  updateVendorDocument,
  deleteVendorDocument,
};

import { z } from 'zod';

const createVendor = z.object({
  body: z.object({
    companyName: z.string(),
    primaryContactName: z.string().optional(),
    primaryContactPhone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    primaryContactEmail: z.string().optional(),
    serviceDescription: z.string(),
    dataProcessingRole: z.string(),
    businessUnitOwner: z.string(),
    organizationId: z.string(),
  }),
});

const getVendors = z.object({
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sortType: z.enum(['asc', 'desc']).optional(),
  }),
});

const getVendor = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const updateVendor = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    companyName: z.string().optional(),
    primaryContactName: z.string().optional(),
    primaryContactPhone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    primaryContactEmail: z.string().optional(),
    serviceDescription: z.string().optional(),
    dataProcessingRole: z.string().optional(),
    businessUnitOwner: z.string().optional(),
    organizationId: z.string().optional(),
  }),
});

const deleteVendor = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default {
  createVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
};

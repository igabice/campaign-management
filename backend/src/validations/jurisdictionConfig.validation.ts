import { z } from 'zod';

const createJurisdictionConfig = z.object({
  body: z.object({
    country: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    requiresDueDiligence: z.boolean().optional(),
    dueDiligenceRequirements: z.string().optional(),
    defaultDPATemplate: z.string().optional(),
    otherNotes: z.string().optional(),
    vendorId: z.string(),
  }),
});

const getJurisdictionConfigs = z.object({
  query: z.object({
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sortType: z.enum(['asc', 'desc']).optional(),
  }),
});

const getJurisdictionConfig = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const updateJurisdictionConfig = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    country: z.string().optional(),
    fileName: z.string().optional(),
    filePath: z.string().optional(),
    requiresDueDiligence: z.boolean().optional(),
    dueDiligenceRequirements: z.string().optional(),
    defaultDPATemplate: z.string().optional(),
    otherNotes: z.string().optional(),
    vendorId: z.string().optional(),
  }),
});

const deleteJurisdictionConfig = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export default {
  createJurisdictionConfig,
  getJurisdictionConfigs,
  getJurisdictionConfig,
  updateJurisdictionConfig,
  deleteJurisdictionConfig,
};

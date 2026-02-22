import { z } from 'zod';

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  category: z.enum(['agents', 'plugins', 'commands', 'settings', 'hooks', 'integrations', 'templates', 'all']).optional().default('all'),
  sort: z.enum(['downloads', 'name', 'newest']).optional().default('downloads'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const componentCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['agents', 'plugins', 'commands', 'settings', 'hooks', 'integrations', 'templates']),
  installCommand: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  sourceUrl: z.string().url().optional(),
  companyId: z.string().optional(),
});

export const componentUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  tags: z.array(z.string()).optional(),
  sourceUrl: z.string().url().optional(),
});

export const downloadEventSchema = z.object({
  componentId: z.string().min(1),
  country: z.string().optional(),
});

export const pageViewEventSchema = z.object({
  path: z.string().min(1),
});

export const trendingParamsSchema = z.object({
  range: z.enum(['today', 'week', 'month']).optional().default('week'),
});

import { z } from 'zod';

export const BrandIdentificationRequestSchema = z
  .object({
    rawRow: z.object({}).passthrough(),
  })
  .strict();

export const BrandIdentificationResultSchema = z
  .object({
    brand: z.string().min(2).nullable(),
    confidence: z.number().min(0).max(1),
    method: z.enum(['header', 'token', 'none']),
  })
  .strict();

export const BrandIdentificationSchemas = {
  BrandIdentificationRequestSchema,
  BrandIdentificationResultSchema,
};

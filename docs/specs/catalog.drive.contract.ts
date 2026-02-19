import { z } from 'zod';

export const DriveVendorSchema = z
  .object({
    vendorId: z.string(),
    name: z.string(),
  })
  .strict();

export const DriveFileSchema = z
  .object({
    fileId: z.string(),
    vendorId: z.string(),
    fileName: z.string(),
    mimeType: z.string(),
    modifiedTime: z.string().datetime(),
  })
  .strict();

export const DriveVendorsResponseSchema = z
  .object({
    items: z.array(DriveVendorSchema),
  })
  .strict();

export const DriveFilesResponseSchema = z
  .object({
    items: z.array(DriveFileSchema),
  })
  .strict();

export const DriveFilesBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

export const CatalogDriveSchemas = {
  DriveVendorSchema,
  DriveFileSchema,
  DriveVendorsResponseSchema,
  DriveFilesResponseSchema,
  DriveFilesBadRequestSchema,
};

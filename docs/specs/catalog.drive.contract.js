const { z } = require('zod');

const DriveVendorSchema = z
  .object({
    vendorId: z.string(),
    name: z.string(),
  })
  .strict();

const DriveFileSchema = z
  .object({
    fileId: z.string(),
    vendorId: z.string(),
    fileName: z.string(),
    mimeType: z.string(),
    modifiedTime: z.string().datetime(),
  })
  .strict();

const DriveVendorsResponseSchema = z
  .object({
    items: z.array(DriveVendorSchema),
  })
  .strict();

const DriveFilesResponseSchema = z
  .object({
    items: z.array(DriveFileSchema),
  })
  .strict();

const DriveFilesBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogDriveSchemas = {
  DriveVendorSchema,
  DriveFileSchema,
  DriveVendorsResponseSchema,
  DriveFilesResponseSchema,
  DriveFilesBadRequestSchema,
};

module.exports = {
  DriveVendorSchema,
  DriveFileSchema,
  DriveVendorsResponseSchema,
  DriveFilesResponseSchema,
  DriveFilesBadRequestSchema,
  CatalogDriveSchemas,
};

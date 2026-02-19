import {
  ModelExtractBadRequestSchema,
  ModelExtractRequestSchema,
  ModelExtractResponseSchema,
} from '../../../../docs/specs/catalog.model-extract.contract.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { enrichSourceRowWithModel } from '../../../../src/catalog/services/modelEnrichmentService.js';

export async function POST(request: Request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    const payload = ModelExtractBadRequestSchema.parse({ error: 'Invalid JSON body' });
    return Response.json(payload, { status: 400 });
  }

  const parsedRequest = ModelExtractRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    const payload = ModelExtractBadRequestSchema.parse({ error: 'Missing required fields' });
    return Response.json(payload, { status: 400 });
  }

  const issueRepo = createIssueRepo();
  const result = enrichSourceRowWithModel({
    rawRow: parsedRequest.data.rawRow,
    issueRepo,
  });
  const payload = ModelExtractResponseSchema.parse({
    vendorId: parsedRequest.data.vendorId,
    fileId: parsedRequest.data.fileId,
    sourceRowId: parsedRequest.data.sourceRowId,
    status: result.status,
    model: result.model ?? null,
    brand: result.brand ?? null,
    issuesCreated: issueRepo.countIssues(),
  });

  return Response.json(payload);
}

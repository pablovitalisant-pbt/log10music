import {
  ParseBadRequestSchema,
  ParseRequestSchema,
  ParseResultSchema,
} from '../../../../docs/specs/catalog.parse.contract.js';
import { createSourceRowRepo } from '../../../../src/catalog/repositories/sourceRowRepo.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { parseCatalogFile } from '../../../../src/catalog/services/fileParseService.js';

export async function POST(request: Request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    const payload = ParseBadRequestSchema.parse({ error: 'Invalid JSON body' });
    return Response.json(payload, { status: 400 });
  }

  const parsedRequest = ParseRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    const payload = ParseBadRequestSchema.parse({ error: 'fileId and vendorId are required' });
    return Response.json(payload, { status: 400 });
  }

  const sourceRowRepo = createSourceRowRepo();
  const issueRepo = createIssueRepo();
  const result = parseCatalogFile({
    fileId: parsedRequest.data.fileId,
    vendorId: parsedRequest.data.vendorId,
    sourceRowRepo,
    issueRepo,
  });

  const payload = ParseResultSchema.parse(result);
  return Response.json(payload);
}

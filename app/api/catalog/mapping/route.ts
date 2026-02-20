import {
  MappingBadRequestSchema,
  ModelMappingRequestSchema,
  ModelMappingResponseSchema,
} from '../../../../docs/specs/catalog.mapping.contract.js';
import { createModelMappingRepo } from '../../../../src/catalog/repositories/modelMappingRepo.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { resolveModelMapping } from '../../../../src/catalog/services/modelMappingService.js';

export async function POST(request: Request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    const payload = MappingBadRequestSchema.parse({ error: 'Invalid JSON body' });
    return Response.json(payload, { status: 400 });
  }

  const parsed = ModelMappingRequestSchema.safeParse(body || {});
  if (!parsed.success) {
    const payload = MappingBadRequestSchema.parse({ error: 'Invalid mapping request' });
    return Response.json(payload, { status: 400 });
  }

  const mappingRepo = createModelMappingRepo();
  const issueRepo = createIssueRepo();
  const result = await resolveModelMapping({
    mappingRepo,
    issueRepo,
    mapping: parsed.data,
  });
  const payload = ModelMappingResponseSchema.parse(result);
  return Response.json(payload);
}

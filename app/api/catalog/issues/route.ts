import {
  IssuesResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { listIssues } from '../../../../src/catalog/services/catalogSyncService.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get('runId') || undefined;
  const issueRepo = createIssueRepo();
  const items = listIssues({ issueRepo, runId });
  const payload = IssuesResponseSchema.parse({ items });
  return Response.json(payload);
}

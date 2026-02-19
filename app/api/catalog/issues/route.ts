import {
  IssuesResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { listIssues } from '../../../../src/catalog/services/catalogSyncService.js';

const FALLBACK_ISSUES = [
  {
    issueId: 'issue-1',
    type: 'needs_mapping',
    vendorId: 'vendor-1',
    fileId: 'file-1',
    fileName: 'lista-a.xlsx',
    detail: {},
    runId: 'run-1',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get('runId') || undefined;
  const issueRepo = createIssueRepo({ store: { issues: FALLBACK_ISSUES } });
  const items = listIssues({ issueRepo, runId });
  const payload = IssuesResponseSchema.parse({ items });
  return Response.json(payload);
}

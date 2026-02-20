const { getSupabaseClient } = require('./supabaseClient');

async function upsertVendor(vendor) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_vendors')
    .upsert(
      {
        vendor_id: vendor.vendorId,
        name: vendor.name,
      },
      { onConflict: 'vendor_id' }
    )
    .select('vendor_id, name')
    .single();
  if (error) throw new Error(`Supabase upsertVendor failed: ${error.message}`);
  return { vendorId: data.vendor_id, name: data.name };
}

async function listVendors() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('catalog_vendors').select('vendor_id, name');
  if (error) throw new Error(`Supabase listVendors failed: ${error.message}`);
  return (data || []).map((row) => ({ vendorId: row.vendor_id, name: row.name }));
}

async function upsertFile(file) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_files')
    .upsert(
      {
        file_id: file.fileId,
        vendor_id: file.vendorId,
        file_name: file.fileName,
        mime_type: file.mimeType,
        modified_time: file.modifiedTime,
      },
      { onConflict: 'file_id' }
    )
    .select('file_id, vendor_id, file_name, mime_type, modified_time')
    .single();
  if (error) throw new Error(`Supabase upsertFile failed: ${error.message}`);
  return {
    fileId: data.file_id,
    vendorId: data.vendor_id,
    fileName: data.file_name,
    mimeType: data.mime_type,
    modifiedTime: data.modified_time,
  };
}

async function listFiles({ vendorId } = {}) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('catalog_files')
    .select('file_id, vendor_id, file_name, mime_type, modified_time');
  if (vendorId) query = query.eq('vendor_id', vendorId);
  const { data, error } = await query;
  if (error) throw new Error(`Supabase listFiles failed: ${error.message}`);
  return (data || []).map((row) => ({
    fileId: row.file_id,
    vendorId: row.vendor_id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    modifiedTime: row.modified_time,
  }));
}

async function upsertRow(row) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_rows')
    .upsert(
      {
        source_row_id: row.sourceRowId,
        vendor_id: row.vendorId,
        file_id: row.fileId,
        file_name: row.fileName || null,
        row_number: row.rowNumber || null,
        raw_row: row.rawRow || {},
      },
      { onConflict: 'source_row_id' }
    )
    .select('source_row_id, vendor_id, file_id, file_name, row_number, raw_row')
    .single();
  if (error) throw new Error(`Supabase upsertRow failed: ${error.message}`);
  return {
    sourceRowId: data.source_row_id,
    vendorId: data.vendor_id,
    fileId: data.file_id,
    fileName: data.file_name,
    rowNumber: data.row_number,
    rawRow: data.raw_row || {},
  };
}

async function listRows({ fileId } = {}) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('catalog_rows')
    .select('source_row_id, vendor_id, file_id, file_name, row_number, raw_row');
  if (fileId) query = query.eq('file_id', fileId);
  const { data, error } = await query;
  if (error) throw new Error(`Supabase listRows failed: ${error.message}`);
  return (data || []).map((row) => ({
    sourceRowId: row.source_row_id,
    vendorId: row.vendor_id,
    fileId: row.file_id,
    fileName: row.file_name,
    rowNumber: row.row_number,
    rawRow: row.raw_row || {},
  }));
}

async function upsertProduct(product) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_products')
    .upsert(
      {
        id: product.id,
        model: product.model,
        brand: product.brand || null,
        available: product.available,
        updated_at: product.updatedAt,
      },
      { onConflict: 'id' }
    )
    .select('id, model, brand, available, updated_at')
    .single();
  if (error) throw new Error(`Supabase upsertProduct failed: ${error.message}`);
  return {
    id: data.id,
    model: data.model,
    brand: data.brand,
    available: data.available,
    updatedAt: data.updated_at,
  };
}

async function listProducts() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_products')
    .select('id, model, brand, available, updated_at');
  if (error) throw new Error(`Supabase listProducts failed: ${error.message}`);
  return (data || []).map((row) => ({
    id: row.id,
    model: row.model,
    brand: row.brand,
    available: row.available,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  }));
}

async function getProductById(id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_products')
    .select('id, model, brand, available, updated_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`Supabase getProductById failed: ${error.message}`);
  if (!data) return null;
  return {
    id: data.id,
    model: data.model,
    brand: data.brand,
    available: data.available,
    updatedAt: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString(),
  };
}

async function addSource(source) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_sources')
    .insert({
      catalog_product_id: source.catalogProductId,
      source_row_id: source.sourceRowId,
      vendor_id: source.vendorId,
      vendor_name: source.vendorName || null,
      file_id: source.fileId,
      file_name: source.fileName || null,
      sheet_name: source.sheetName || null,
      row_number: source.rowNumber || null,
    })
    .select(
      'catalog_product_id, source_row_id, vendor_id, vendor_name, file_id, file_name, sheet_name, row_number'
    )
    .single();
  if (error) throw new Error(`Supabase addSource failed: ${error.message}`);
  return {
    catalogProductId: data.catalog_product_id,
    sourceRowId: data.source_row_id,
    vendorId: data.vendor_id,
    vendorName: data.vendor_name,
    fileId: data.file_id,
    fileName: data.file_name,
    sheetName: data.sheet_name,
    rowNumber: data.row_number,
  };
}

async function deleteSourcesByFile(fileId) {
  if (!fileId) return 0;
  const supabase = getSupabaseClient();
  const { error, count } = await supabase
    .from('catalog_sources')
    .delete({ count: 'exact' })
    .eq('file_id', fileId);
  if (error) throw new Error(`Supabase deleteSourcesByFile failed: ${error.message}`);
  return count || 0;
}

async function deleteRowsByFile(fileId) {
  if (!fileId) return 0;
  const supabase = getSupabaseClient();
  const { error, count } = await supabase
    .from('catalog_rows')
    .delete({ count: 'exact' })
    .eq('file_id', fileId);
  if (error) throw new Error(`Supabase deleteRowsByFile failed: ${error.message}`);
  return count || 0;
}

async function deleteOrphanProducts() {
  const supabase = getSupabaseClient();
  const { data: sources, error: sourceError } = await supabase
    .from('catalog_sources')
    .select('catalog_product_id');
  if (sourceError) throw new Error(`Supabase listSources for cleanup failed: ${sourceError.message}`);
  const keepIds = new Set((sources || []).map((row) => row.catalog_product_id));
  const { data: products, error: productError } = await supabase
    .from('catalog_products')
    .select('id');
  if (productError) throw new Error(`Supabase listProducts for cleanup failed: ${productError.message}`);
  const toDelete = (products || [])
    .map((row) => row.id)
    .filter((id) => !keepIds.has(id));
  if (toDelete.length === 0) return 0;
  const chunkSize = 200;
  let deleted = 0;
  for (let index = 0; index < toDelete.length; index += chunkSize) {
    const chunk = toDelete.slice(index, index + chunkSize);
    const { error, count } = await supabase
      .from('catalog_products')
      .delete({ count: 'exact' })
      .in('id', chunk);
    if (error) throw new Error(`Supabase deleteOrphanProducts failed: ${error.message}`);
    deleted += count || 0;
  }
  return deleted;
}
async function listSources({ catalogProductId } = {}) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('catalog_sources')
    .select(
      'catalog_product_id, source_row_id, vendor_id, vendor_name, file_id, file_name, sheet_name, row_number'
    );
  if (catalogProductId) query = query.eq('catalog_product_id', catalogProductId);
  const { data, error } = await query;
  if (error) throw new Error(`Supabase listSources failed: ${error.message}`);
  return (data || []).map((row) => ({
    catalogProductId: row.catalog_product_id,
    sourceRowId: row.source_row_id,
    vendorId: row.vendor_id,
    vendorName: row.vendor_name,
    fileId: row.file_id,
    fileName: row.file_name,
    sheetName: row.sheet_name,
    rowNumber: row.row_number,
  }));
}

async function addIssue(issue) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_issues')
    .insert({
      issue_id: issue.issueId,
      type: issue.type,
      vendor_id: issue.vendorId,
      file_id: issue.fileId,
      file_name: issue.fileName,
      detail: issue.detail || {},
      resolved: issue.resolved || false,
    })
    .select('issue_id, type, vendor_id, file_id, file_name, detail, resolved')
    .single();
  if (error) throw new Error(`Supabase addIssue failed: ${error.message}`);
  return {
    issueId: data.issue_id,
    type: data.type,
    vendorId: data.vendor_id,
    fileId: data.file_id,
    fileName: data.file_name,
    detail: data.detail || {},
    resolved: data.resolved,
  };
}

async function listIssues() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_issues')
    .select('issue_id, type, vendor_id, file_id, file_name, detail, resolved');
  if (error) throw new Error(`Supabase listIssues failed: ${error.message}`);
  return (data || []).map((row) => ({
    issueId: row.issue_id,
    type: row.type,
    vendorId: row.vendor_id,
    fileId: row.file_id,
    fileName: row.file_name,
    detail: row.detail || {},
    resolved: row.resolved,
  }));
}

async function resolveIssue(issueId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_issues')
    .update({ resolved: true })
    .eq('issue_id', issueId)
    .select('issue_id, type, vendor_id, file_id, file_name, detail, resolved')
    .maybeSingle();
  if (error) throw new Error(`Supabase resolveIssue failed: ${error.message}`);
  if (!data) return null;
  return {
    issueId: data.issue_id,
    type: data.type,
    vendorId: data.vendor_id,
    fileId: data.file_id,
    fileName: data.file_name,
    detail: data.detail || {},
    resolved: data.resolved,
  };
}

async function addSyncRun(run) {
  const supabase = getSupabaseClient();
  const resolvedFinishedAt = run.finishedAt
    ? new Date(run.finishedAt).toISOString()
    : null;
  const { data, error } = await supabase
    .from('catalog_sync_runs')
    .insert({
      run_id: run.runId,
      started_at: run.startedAt,
      finished_at: resolvedFinishedAt,
      stats: run.stats || {},
    })
    .select('run_id, started_at, finished_at, stats')
    .single();
  if (error) throw new Error(`Supabase addSyncRun failed: ${error.message}`);
  return {
    runId: data.run_id,
    startedAt: data.started_at,
    finishedAt: data.finished_at,
    stats: data.stats || {},
  };
}

async function updateSyncRun(runId, patch) {
  const supabase = getSupabaseClient();
  const resolvedFinishedAt = patch.finishedAt
    ? new Date(patch.finishedAt).toISOString()
    : patch.finishedAt === null
      ? null
      : undefined;
  const updatePayload = {
    stats: patch.stats,
  };
  if (resolvedFinishedAt !== undefined) {
    updatePayload.finished_at = resolvedFinishedAt;
  }
  const { data, error } = await supabase
    .from('catalog_sync_runs')
    .update(updatePayload)
    .eq('run_id', runId)
    .select('run_id, started_at, finished_at, stats')
    .maybeSingle();
  if (error) throw new Error(`Supabase updateSyncRun failed: ${error.message}`);
  if (!data) return null;
  return {
    runId: data.run_id,
    startedAt: data.started_at,
    finishedAt: data.finished_at ? new Date(data.finished_at).toISOString() : null,
    stats: data.stats || {},
  };
}

async function listSyncRuns() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_sync_runs')
    .select('run_id, started_at, finished_at, stats')
    .order('started_at', { ascending: false });
  if (error) throw new Error(`Supabase listSyncRuns failed: ${error.message}`);
  const normalizeIso = (value) => {
    if (!value) return null;
    return new Date(value).toISOString();
  };
  return (data || []).map((row) => ({
    runId: row.run_id,
    startedAt: normalizeIso(row.started_at),
    finishedAt: normalizeIso(row.finished_at),
    stats: row.stats || {},
  }));
}

async function getLatestSyncRun() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('catalog_sync_runs')
    .select('run_id, started_at, finished_at, stats')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Supabase getLatestSyncRun failed: ${error.message}`);
  if (!data) return null;
  const normalizeIso = (value) => {
    if (!value) return null;
    return new Date(value).toISOString();
  };
  return {
    runId: data.run_id,
    startedAt: normalizeIso(data.started_at),
    finishedAt: normalizeIso(data.finished_at),
    stats: data.stats || {},
  };
}

module.exports = {
  upsertVendor,
  listVendors,
  upsertFile,
  listFiles,
  upsertRow,
  listRows,
  upsertProduct,
  listProducts,
  getProductById,
  addSource,
  listSources,
  addIssue,
  listIssues,
  resolveIssue,
  addSyncRun,
  updateSyncRun,
  listSyncRuns,
  getLatestSyncRun,
  deleteSourcesByFile,
  deleteRowsByFile,
  deleteOrphanProducts,
};

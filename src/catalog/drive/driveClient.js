const { google } = require('googleapis');

function parseServiceAccountJson(rawJson) {
  if (!rawJson) return null;
  try {
    return JSON.parse(rawJson);
  } catch (error) {
    return null;
  }
}

function createDriveClient({ rootFolderId, serviceAccountJson } = {}) {
  const resolvedRootFolderId = rootFolderId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const resolvedServiceAccountJson =
    serviceAccountJson || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const credentials = parseServiceAccountJson(resolvedServiceAccountJson);
  if (!resolvedRootFolderId || !credentials) {
    return {
      async listVendors() {
        return [];
      },
      async listFiles() {
        return [];
      },
      async downloadFile() {
        return null;
      },
    };
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const drive = google.drive({ version: 'v3', auth });

  return {
    async listVendors() {
      const response = await drive.files.list({
        q: `'${resolvedRootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id,name)',
        supportsAllDrives: false,
      });
      const files = response.data.files || [];
      return files.map((folder) => ({
        vendorId: folder.id,
        name: folder.name || 'Sin nombre',
      }));
    },
    async listFiles(vendorId) {
      if (!vendorId) return [];
      const response = await drive.files.list({
        q: `'${vendorId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'files(id,name,mimeType,modifiedTime)',
        supportsAllDrives: false,
      });
      const files = response.data.files || [];
      return files.map((file) => ({
        fileId: file.id,
        vendorId,
        fileName: file.name || 'Sin nombre',
        mimeType: file.mimeType || 'application/octet-stream',
        modifiedTime: file.modifiedTime || new Date().toISOString(),
      }));
    },
    async downloadFile({ fileId, mimeType }) {
      if (!fileId) return null;
      if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        const response = await drive.files.export(
          { fileId, mimeType: 'text/csv' },
          { responseType: 'arraybuffer' }
        );
        return Buffer.from(response.data);
      }
      const response = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    },
  };
}

module.exports = {
  createDriveClient,
};

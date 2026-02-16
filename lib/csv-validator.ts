/**
 * Validates CSV file for upload
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  // Check file extension
  const validExtensions = ['.csv'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Only CSV files are allowed.'
    };
  }

  // Check MIME type
  const validMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  if (file.type && !validMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a valid CSV file.'
    };
  }

  // Check file size (10MB limit)
  const maxSize = 100 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a file with content.'
    };
  }

  return { valid: true };
}

/**
 * Sanitizes filename to prevent path traversal and remove special characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  let sanitized = filename.replace(/^.*[\\\/]/, '');

  // Remove or replace special characters, keep only alphanumeric, dots, hyphens, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Remove leading dots to prevent hidden files
  sanitized = sanitized.replace(/^\.+/, '');

  // Ensure filename is not empty after sanitization
  if (!sanitized || sanitized === '') {
    sanitized = 'file.csv';
  }

  // Limit filename length (max 200 characters)
  if (sanitized.length > 200) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    sanitized = sanitized.substring(0, 200 - ext.length) + ext;
  }

  return sanitized;
}

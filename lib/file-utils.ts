import { sanitizeFilename } from './csv-validator';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates a timestamped filename to prevent collisions
 */
export function generateTimestampedFilename(originalName: string): string {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(originalName);
  const ext = path.extname(sanitized);
  const nameWithoutExt = path.basename(sanitized, ext);

  return `${timestamp}_${nameWithoutExt}${ext}`;
}

/**
 * Ensures a directory exists, creates it if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

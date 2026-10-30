import fs from "fs";
import path from "path";
import os from "os";

/**
 * Robust Atomic Storage Engine
 * Persists data across server restarts and serverless cold-starts.
 * Features:
 * - Atomic write via temp file + rename to prevent data corruption.
 * - Serverless resilience: falls back to os.tmpdir() if project directory is read-only (e.g. Vercel).
 * - Immediate error propagation: throws / returns false on write failure so callers can abort safely.
 */

declare global {
  var __lkl_storage_cache: Map<string, unknown> | undefined;
}

function getCache(): Map<string, unknown> {
  if (!global.__lkl_storage_cache) {
    global.__lkl_storage_cache = new Map();
  }
  return global.__lkl_storage_cache;
}

let resolvedStorageDir: string | null = null;

export function getStorageDirectory(): string {
  if (resolvedStorageDir) return resolvedStorageDir;

  if (process.env.STORAGE_DIR) {
    resolvedStorageDir = process.env.STORAGE_DIR;
    return resolvedStorageDir;
  }

  const standardDir = path.join(process.cwd(), "data", "storage");

  // Test if standard directory is writable
  try {
    if (!fs.existsSync(standardDir)) {
      fs.mkdirSync(standardDir, { recursive: true });
    }
    const testFile = path.join(standardDir, `.write-test-${Date.now()}.tmp`);
    fs.writeFileSync(testFile, "ok", "utf-8");
    fs.unlinkSync(testFile);
    resolvedStorageDir = standardDir;
    return resolvedStorageDir;
  } catch {
    // If standard directory is read-only (such as Vercel /var/task), fallback to OS temp dir
    const tmpStorage = path.join(os.tmpdir(), "lkl_storage");
    try {
      if (!fs.existsSync(tmpStorage)) {
        fs.mkdirSync(tmpStorage, { recursive: true });
      }
      resolvedStorageDir = tmpStorage;
      console.warn(`[StorageEngine] Standard storage is read-only. Falling back to writable temp: ${tmpStorage}`);
      return resolvedStorageDir;
    } catch {
      resolvedStorageDir = standardDir;
      return resolvedStorageDir;
    }
  }
}

export function readStorageFile<T>(filename: string, fallback: T): T {
  const cache = getCache();
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }

  const storageDir = getStorageDirectory();
  const filePath = path.join(storageDir, filename);

  try {
    if (!fs.existsSync(filePath)) {
      // Also check standard cwd data/storage if we fell back to temp
      const seedPath = path.join(process.cwd(), "data", "storage", filename);
      if (fs.existsSync(seedPath)) {
        const seedContent = fs.readFileSync(seedPath, "utf-8");
        if (seedContent && seedContent.trim() !== "") {
          const parsed = JSON.parse(seedContent) as T;
          cache.set(filename, parsed);
          // Try to copy to current writable storage
          try {
            writeStorageFile(filename, parsed);
          } catch {
            // Ignore if copy fails
          }
          return parsed;
        }
      }

      cache.set(filename, fallback);
      return fallback;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    if (!content || content.trim() === "") {
      cache.set(filename, fallback);
      return fallback;
    }

    const parsed = JSON.parse(content) as T;
    cache.set(filename, parsed);
    return parsed;
  } catch (err) {
    console.warn(`[StorageEngine] Failed reading ${filename}, using fallback:`, err instanceof Error ? err.message : err);
    cache.set(filename, fallback);
    return fallback;
  }
}

export function writeStorageFile<T>(filename: string, data: T): boolean {
  const cache = getCache();
  const storageDir = getStorageDirectory();

  try {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, filename);
    const tempPath = path.join(
      storageDir,
      `.${filename}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`
    );

    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, jsonString, "utf-8");
    fs.renameSync(tempPath, filePath);

    // Update in-memory cache
    cache.set(filename, data);
    return true;
  } catch (err) {
    console.error(`[StorageEngine] Critical error writing ${filename}:`, err);
    throw new Error(`تعذر حفظ البيانات في ملف التخزين (${filename}): ${err instanceof Error ? err.message : "خطأ غير معروف"}`);
  }
}

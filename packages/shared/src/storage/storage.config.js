import { readFileSync, existsSync } from 'node:fs';

let _env = {};

function load() {
  try {
    if (existsSync('.env')) {
      const content = readFileSync('.env', 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        _env[key] = value;
      }
    }
  } catch {
    // .env might not be at cwd, that's fine
  }

  _env = {
    STORAGE_BACKEND: process.env.STORAGE_BACKEND || _env.STORAGE_BACKEND || 'local',
    STORAGE_PATH: process.env.STORAGE_PATH || _env.STORAGE_PATH || './uploads',
    UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL || _env.UPLOAD_BASE_URL || '',
    S3_BUCKET: process.env.S3_BUCKET || _env.S3_BUCKET || '',
    S3_REGION: process.env.S3_REGION || _env.S3_REGION || '',
  };
}

load();

export const storageConfig = _env;

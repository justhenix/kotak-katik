import { defineConfig } from '@playwright/test';
import local from './playwright.config';

const baseURL = process.env.MVP_BASE_URL;
if (!baseURL) throw new Error('Set MVP_BASE_URL to the deployed game URL.');

export default defineConfig(local, {
  use: { ...local.use, baseURL },
  webServer: undefined,
});

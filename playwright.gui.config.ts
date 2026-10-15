import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  projects: base.projects?.map(project => project.name === 'desktop'
    ? { ...project, use: { ...project.use, viewport: { width: 1440, height: 900 } } }
    : { ...project, use: { ...project.use, deviceScaleFactor: 1 } }),
  use: { ...base.use, baseURL: 'http://127.0.0.1:4197' },
  webServer: { command: 'bun run preview --port 4197 --strictPort', url: 'http://127.0.0.1:4197', reuseExistingServer: false },
});

import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// Keep this worktree's production preview separate from the GUI agent's server.
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: 'http://127.0.0.1:4175' },
  webServer: {
    command: 'bun run preview --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
  },
});

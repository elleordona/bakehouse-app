import { defineConfig } from '@playwright/test'

const stackName = process.env.BAKEHOUSE_STACK_NAME
const BASE_URL = `https://${stackName}.cta-training.academy/`;

export default defineConfig({
  reporter: [
    ['html'],
    ['github']
  ],
  testDir: './test/playwright',
  use: {
    baseURL: BASE_URL,
    headless: true
  }
})

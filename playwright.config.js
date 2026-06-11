const { defineConfig } = require('@playwright/test');

const stackName = process.env.BAKEHOUSE_STACK_NAME
const BASE_URL = `https://${stackName}.cta-training.academy/`;

module.exports = defineConfig({
  testDir: './test/playwright',
  use: {
    baseURL: BASE_URL,
    headless: false
  }
});

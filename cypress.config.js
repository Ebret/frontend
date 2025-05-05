const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3002',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'http://localhost:5000',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
});

# Screenshot Capture Guide for Presentations

This guide explains how to use the screenshot capture tool to generate screenshots for the Credit Cooperative System presentation documents.

## Overview

The screenshot capture tool is designed to automatically navigate through the Credit Cooperative System and capture screenshots of key screens. These screenshots are then used in the presentation documents to provide visual examples of the system's features.

## Prerequisites

Before running the screenshot capture tool, ensure you have:

1. **Node.js installed** (version 12 or higher)
2. **A running instance of the Credit Cooperative System**
   - This can be a local development environment
   - Or a staging/production environment

## Running the Tool

### Option 1: Using the Batch File (Windows)

1. Double-click the `capture-screenshots.bat` file in the root directory
2. Follow the on-screen prompts

### Option 2: Using Node.js Directly

1. Open a command prompt or terminal
2. Navigate to the project root directory
3. Run the command: `node capture-screenshots.js`
4. Follow the on-screen prompts

## Configuration Options

When running the tool, you'll be presented with several options:

1. **Capture all screenshots** - This will capture all defined screenshots
2. **Configure environment** - This allows you to set up the URLs and other options
3. **Exit** - Exit the tool

### Environment Configuration

If you choose to configure the environment, you'll be asked:

1. **Use local development environment?** (y/n)
   - If yes, the tool will use localhost URLs (http://localhost:3001, etc.)
   - If no, you'll be prompted to enter custom URLs

2. **Run in headless mode?** (y/n)
   - If yes, the browser will run in the background (faster, but you won't see it)
   - If no, the browser will be visible (slower, but you can watch the process)

## Screenshot Definitions

The tool is configured to capture the following screenshots:

### Main Application
- **main-login** - Main login screen
- **member-dashboard** - Member dashboard
- **account-overview** - Account overview
- **transaction-history** - Transaction history
- **loan-application** - Loan application form
- **teller-dashboard** - Teller dashboard
- **admin-dashboard** - Admin dashboard

### E-Wallet
- **ewallet-dashboard** - E-Wallet dashboard
- **fund-transfer** - Fund transfer form
- **damayan-dashboard** - Damayan dashboard

### Deployment Management
- **deployment-dashboard** - Deployment dashboard
- **change-history** - Change history
- **undo-confirmation** - Undo confirmation
- **apply-changes** - Apply changes button

### Monitoring
- **monitoring-dashboard** - Monitoring dashboard
- **alert-configuration** - Alert configuration

## Test Accounts

The tool uses the following test accounts:

- **Admin**: Username: admin, Password: admin123
- **Member**: Username: member, Password: member123
- **Teller**: Username: teller, Password: teller123

If your system uses different credentials, you'll need to update the `accounts` object in the `capture-screenshots.js` file.

## Troubleshooting

### Common Issues

1. **Browser doesn't start**
   - Ensure you have sufficient system resources
   - Try running in headless mode

2. **Login fails**
   - Check that the test accounts exist in your system
   - Verify the login form selectors match your application

3. **Elements not found**
   - The tool uses CSS selectors to find elements
   - If your application's HTML structure differs, update the selectors in the script

4. **Screenshots are blank or show errors**
   - Ensure the application is running and accessible
   - Check that the URLs are correct
   - Verify that the pages require authentication

### Modifying the Script

If you need to modify the script to work with your specific system:

1. Open the `capture-screenshots.js` file in a text editor
2. Update the `config` object at the top of the file:
   - `urls` - The URLs for different parts of the system
   - `accounts` - The test account credentials
   - `screenshots` - The definition of screenshots to capture

3. For each screenshot definition, you can modify:
   - `name` - The filename for the screenshot
   - `url` - Which URL to use (main, ewallet, deploy, monitoring)
   - `login` - Which account to use for authentication
   - `path` - Additional path to append to the URL
   - `selector` - CSS selector to wait for before taking the screenshot
   - `description` - Description of the screenshot

## Using the Screenshots

After running the tool, the screenshots will be saved in the `docs/management/screenshots` directory. These screenshots can be used in the following presentation documents:

1. **system-walkthrough-presentation.md** - Visual walkthrough of the entire system
2. **undo-redo-functionality-guide.md** - Detailed guide for the undo/redo functionality

To use the screenshots in these documents, ensure the filenames match those referenced in the documents.

## Manual Screenshot Capture

If the automated tool cannot capture certain screens (e.g., complex interactions, animations), you can capture screenshots manually:

1. Navigate to the desired screen in your browser
2. Use browser developer tools to ensure the correct state is displayed
3. Take a screenshot (browser tools or OS screenshot function)
4. Save the screenshot to the `docs/management/screenshots` directory with the appropriate name

## Additional Notes

- The tool uses Puppeteer, a headless Chrome browser automation library
- Screenshots are captured at 1280x720 resolution
- The tool includes a small delay between actions to ensure pages load properly
- If a selector is not found, the tool will still take a screenshot and continue

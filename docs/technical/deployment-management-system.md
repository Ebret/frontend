# Deployment Management System Technical Documentation

## Overview

The Deployment Management System (DMS) is a custom-built web application that provides a centralized interface for managing deployments across all environments of the Credit Cooperative System. It includes advanced features such as deployment controls (deploy, undo, redo), automatic validation, and secure data synchronization between environments.

## System Architecture

The DMS is built using the following technology stack:

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templates with Bootstrap and jQuery
- **Database**: PostgreSQL
- **Authentication**: Passport.js with local strategy and 2FA
- **Version Control Integration**: Git via simple-git
- **Task Scheduling**: node-cron
- **Logging**: Winston

## Core Features

### 1. Deployment Controls

#### Deploy Button
- Initiates deployment of code to the selected environment
- Performs pre-deployment validation
- Creates deployment snapshots for rollback capability
- Executes deployment scripts (git pull, npm install, build, restart services)
- Logs all deployment activities

#### Undo Button
- Reverts to the previous deployment state
- Uses Git to checkout the previous commit
- Restores database to pre-deployment state using snapshots
- Maintains an audit trail of all rollback operations

#### Redo Button
- Reapplies previously undone changes
- Maintains a history of deployment states
- Allows navigation through deployment history

#### Apply Changes Button
- Confirms changes after review
- Performs final validation checks
- Implements changes with proper logging and notifications
- Includes automatic review of:
  - Code changes (diff analysis)
  - Database schema changes
  - Security implications
  - Performance impact

### 2. Validation System

The validation system automatically checks deployments for issues:

#### Code Validation
- Static code analysis
- Linting checks
- Security vulnerability scanning
- Dependency analysis

#### Database Validation
- Schema compatibility checks
- Migration validation
- Data integrity verification
- Performance impact assessment

#### Security Validation
- Authentication checks
- Authorization rules verification
- Input validation
- OWASP Top 10 vulnerability scanning

### 3. Data Synchronization

The system provides secure methods to copy data from production to lower environments:

#### Security Measures
- Requires admin privileges
- Two-factor authentication for data sync operations
- IP restriction for sync operations
- Comprehensive audit logging
- Email notifications to security team

#### Data Anonymization
- Automatic anonymization of personal information:
  - Names replaced with random names
  - Emails replaced with dummy emails
  - Phone numbers replaced with generated numbers
  - Addresses scrambled while maintaining format
  - Financial data scaled by random factors
- Configurable anonymization rules per table/field
- Preservation of data relationships and referential integrity

#### Synchronization Options
- Full database synchronization
- Selected tables synchronization
- Exclusion of sensitive tables
- Scheduling options (immediate or off-hours)
- Bandwidth throttling for minimal production impact

## User Interface

### Dashboard
- Overview of all environments and their status
- Recent deployment history
- System health indicators
- Quick action buttons

### Environment Management
- Environment-specific details and configurations
- Deployment history per environment
- Environment variables management
- Service status and controls

### Deployment Controls
- Deploy form with environment selection
- Undo/Redo controls with deployment history
- Validation results display
- Confirmation dialogs with change summaries

### Data Synchronization
- Source and target environment selection
- Table selection interface
- Anonymization options
- Schedule configuration
- Security validation steps

## Security Architecture

### Authentication
- Username/password with strong password policy
- Two-factor authentication for sensitive operations
- Session management with secure cookies
- Failed login attempt limiting

### Authorization
- Role-based access control:
  - Administrator: Full access
  - DevOps: Deployment and synchronization
  - Developer: View and deploy to dev/test
  - QA: View and deploy to test
  - Auditor: View-only access
- Environment-specific permissions
- Operation-specific permissions

### Audit Logging
- Comprehensive logging of all operations
- Immutable audit trail
- Log forwarding to security monitoring
- Regular audit log reviews

## Database Schema

The DMS uses the following core tables:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL,
  two_factor_secret VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Deployments Table
```sql
CREATE TABLE deployments (
  id SERIAL PRIMARY KEY,
  environment VARCHAR(20) NOT NULL,
  git_commit VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL,
  deployed_by INTEGER REFERENCES users(id),
  deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  validation_results JSONB
);
```

### Deployment History Table
```sql
CREATE TABLE deployment_history (
  id SERIAL PRIMARY KEY,
  deployment_id INTEGER REFERENCES deployments(id),
  action VARCHAR(20) NOT NULL,
  performed_by INTEGER REFERENCES users(id),
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  previous_state JSONB,
  new_state JSONB
);
```

### Data Synchronization Table
```sql
CREATE TABLE data_syncs (
  id SERIAL PRIMARY KEY,
  source_env VARCHAR(20) NOT NULL,
  target_env VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  requested_by INTEGER REFERENCES users(id),
  approved_by INTEGER REFERENCES users(id),
  tables_included TEXT[],
  tables_excluded TEXT[],
  anonymization_applied BOOLEAN DEFAULT TRUE,
  sync_log TEXT
);
```

## Implementation Guidelines

### Deployment Button Implementation

The deployment process follows these steps:

1. **Pre-deployment Validation**
   ```javascript
   async function validateDeployment(environment, commitId) {
     // Run code validation
     const codeValidation = await validateCode(environment, commitId);
     
     // Run database validation
     const dbValidation = await validateDatabase(environment);
     
     // Run security validation
     const securityValidation = await validateSecurity(environment);
     
     // Combine results
     return {
       valid: codeValidation.valid && dbValidation.valid && securityValidation.valid,
       issues: [...codeValidation.issues, ...dbValidation.issues, ...securityValidation.issues],
       warnings: [...codeValidation.warnings, ...dbValidation.warnings, ...securityValidation.warnings]
     };
   }
   ```

2. **Create Deployment Snapshot**
   ```javascript
   async function createDeploymentSnapshot(environment) {
     // Create database backup
     const dbBackup = await createDatabaseBackup(environment);
     
     // Store current git commit
     const gitCommit = await getCurrentGitCommit(environment);
     
     // Store environment variables
     const envVars = await getEnvironmentVariables(environment);
     
     return {
       timestamp: new Date(),
       dbBackup,
       gitCommit,
       envVars
     };
   }
   ```

3. **Execute Deployment**
   ```javascript
   async function executeDeployment(environment, commitId) {
     // Pull latest code
     await gitPull(environment);
     
     // Checkout specific commit if provided
     if (commitId) {
       await gitCheckout(environment, commitId);
     }
     
     // Install dependencies
     await npmInstall(environment);
     
     // Run database migrations
     await runMigrations(environment);
     
     // Build application
     await buildApplication(environment);
     
     // Restart services
     await restartServices(environment);
     
     return { success: true };
   }
   ```

### Undo/Redo Implementation

The undo/redo functionality is implemented using a state management pattern:

```javascript
async function undoDeployment(deploymentId) {
  // Get deployment details
  const deployment = await getDeployment(deploymentId);
  
  // Get previous deployment
  const previousDeployment = await getPreviousDeployment(deployment.environment, deploymentId);
  
  if (!previousDeployment) {
    throw new Error('No previous deployment found to undo to');
  }
  
  // Store current state for potential redo
  await storeDeploymentState(deploymentId, 'current');
  
  // Restore git commit
  await gitCheckout(deployment.environment, previousDeployment.git_commit);
  
  // Restore database
  await restoreDatabase(deployment.environment, previousDeployment.id);
  
  // Rebuild and restart
  await buildApplication(deployment.environment);
  await restartServices(deployment.environment);
  
  // Log the undo operation
  await logDeploymentHistory(deploymentId, 'undo', previousDeployment.id);
  
  return { success: true, previousDeploymentId: previousDeployment.id };
}
```

### Data Synchronization Implementation

The data synchronization process includes these key components:

```javascript
async function synchronizeData(sourceEnv, targetEnv, options) {
  // Validate permissions
  await validateSyncPermissions(sourceEnv, targetEnv, options.requestedBy);
  
  // Create database dump from source
  const dumpFile = await createDatabaseDump(sourceEnv, options.tablesIncluded, options.tablesExcluded);
  
  // Apply anonymization if required
  if (options.anonymize) {
    await anonymizeData(dumpFile, options.anonymizationRules);
  }
  
  // Restore to target environment
  await restoreToTarget(targetEnv, dumpFile);
  
  // Verify data integrity
  const integrityCheck = await verifyDataIntegrity(targetEnv);
  
  // Log synchronization
  await logDataSync(sourceEnv, targetEnv, options, integrityCheck);
  
  return { success: true, integrityCheck };
}
```

## Security Considerations

- All sensitive operations require two-factor authentication
- Data synchronization from production requires approval workflow
- Personal data is automatically anonymized when copying to non-production environments
- All actions are logged with user, timestamp, IP address, and details
- Regular security audits of the deployment system itself
- Encrypted communication between all components
- Least privilege principle applied to all operations

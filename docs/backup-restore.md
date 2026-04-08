# Backup and Restore Guide for Credit Cooperative System

This document provides instructions for creating full backups of the Credit Cooperative System and restoring from those backups.

## Backup Process

The system includes comprehensive backup scripts that handle both the source code and database. The scripts create a timestamped backup directory containing:

- Complete database dump
- Source code (excluding large directories like node_modules)
- Configuration files
- Backup summary
- Compressed archive of the entire backup

### Creating a Backup

#### Windows

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the backup script:

```powershell
cd C:\Install\eds\Coop\japs
.\scripts\create-full-backup.ps1
```

By default, backups are stored in `C:\Backups\CreditCooperative\[timestamp]`.

#### Linux/macOS

1. Open Terminal
2. Navigate to the project directory
3. Make the script executable (first time only):

```bash
chmod +x scripts/create-full-backup.sh
```

4. Run the backup script:

```bash
cd /path/to/project
./scripts/create-full-backup.sh
```

By default, backups are stored in `/backups/CreditCooperative/[timestamp]`.

### Customizing Backup Location

#### Windows

Edit the `scripts/create-full-backup.ps1` file and modify the `$backupDir` variable:

```powershell
$backupDir = "D:\YourCustomPath\Backups\CreditCooperative\$timestamp"
```

#### Linux/macOS

Edit the `scripts/create-full-backup.sh` file and modify the `BACKUP_DIR` variable:

```bash
BACKUP_DIR="/your/custom/path/CreditCooperative/$TIMESTAMP"
```

## Restore Process

### Restoring the Database

1. Ensure PostgreSQL is installed and running
2. Locate your database backup file (`.sql` file in the `database` folder of your backup)
3. Restore the database:

#### Windows

```powershell
# Set environment variables
$env:PGPASSWORD = "postgres"

# Create the database if it doesn't exist
psql -h localhost -U postgres -c "CREATE DATABASE cooperative_e_wallet WITH ENCODING='UTF8' OWNER=postgres;"

# Restore the database
pg_restore -h localhost -U postgres -d cooperative_e_wallet -c "C:\path\to\backup\database\cooperative_e_wallet-[timestamp].sql"

# Clear password from environment
$env:PGPASSWORD = ""
```

#### Linux/macOS

```bash
# Set environment variables
export PGPASSWORD="postgres"

# Create the database if it doesn't exist
psql -h localhost -U postgres -c "CREATE DATABASE cooperative_e_wallet WITH ENCODING='UTF8' OWNER=postgres;"

# Restore the database
pg_restore -h localhost -U postgres -d cooperative_e_wallet -c "/path/to/backup/database/cooperative_e_wallet-[timestamp].sql"

# Clear password from environment
unset PGPASSWORD
```

### Restoring the Code

1. Create or navigate to your project directory
2. Extract the code from your backup:

#### Windows

```powershell
# Create project directory if it doesn't exist
New-Item -ItemType Directory -Path "C:\Install\eds\Coop\japs" -Force

# Copy code from backup
Copy-Item -Path "C:\path\to\backup\code\*" -Destination "C:\Install\eds\Coop\japs" -Recurse -Force
```

#### Linux/macOS

```bash
# Create project directory if it doesn't exist
mkdir -p /path/to/project

# Copy code from backup
cp -R /path/to/backup/code/* /path/to/project/
```

### Restoring Configuration Files

1. Ensure your configuration files match your current environment
2. Pay special attention to the `.env` file and update database connection strings if needed

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cooperative_e_wallet"
```

### Rebuilding the Application

After restoring the code and database, rebuild the application:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the application
npm run build
```

## Backup Verification

To verify your backup:

1. Restore to a test environment
2. Start the application
3. Verify that all functionality works as expected
4. Check that data is correctly restored

## Automated Backup Schedule

For production environments, it's recommended to schedule regular backups:

### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create a new task
3. Set the trigger (e.g., daily at 2 AM)
4. Set the action to run the PowerShell script:
   - Program: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\Install\eds\Coop\japs\scripts\create-full-backup.ps1"`

### Linux/macOS (Cron)

1. Open the crontab editor:

```bash
crontab -e
```

2. Add a line to schedule the backup (e.g., daily at 2 AM):

```
0 2 * * * /path/to/project/scripts/create-full-backup.sh
```

## Backup Retention Policy

Consider implementing a backup retention policy to manage disk space:

- Keep daily backups for 7 days
- Keep weekly backups for 4 weeks
- Keep monthly backups for 12 months

You can create a script to automatically clean up old backups based on this policy.

## Emergency Recovery Procedure

In case of system failure:

1. Set up a new server if necessary
2. Install required software (Node.js, PostgreSQL, etc.)
3. Restore the most recent backup following the steps above
4. Verify system functionality
5. Update DNS records if the server IP has changed

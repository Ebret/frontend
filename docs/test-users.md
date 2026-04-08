# Test Users for Development and Testing

This document provides information about the test users available for development and testing purposes in the Credit Cooperative System.

## Available Test Users

All test users share the same password: `Password123!`

| Role | Email | Description |
|------|-------|-------------|
| Admin / System Administrator | admin@kacooperatiba.com | Has full access to all system features and settings |
| Board of Directors | director@kacooperatiba.com | Can view reports, approve high-value loans, and make strategic decisions |
| General Manager | manager@kacooperatiba.com | Oversees daily operations and has access to most system features |
| Credit Officer | credit@kacooperatiba.com | Processes loan applications and manages loan portfolios |
| Accountant | accountant@kacooperatiba.com | Manages financial records, general ledger, and financial reports |
| Teller | teller@kacooperatiba.com | Handles cash transactions, deposits, and withdrawals |
| Compliance Officer | compliance@kacooperatiba.com | Ensures regulatory compliance and conducts internal audits |
| Regular Member | member@kacooperatiba.com | A standard cooperative member who can apply for loans and manage their accounts |
| Membership Officer | membership@kacooperatiba.com | Manages member applications and member information |
| Security Manager | security@kacooperatiba.com | Manages security settings and audit logs |
| Marketing Officer | marketing@kacooperatiba.com | Manages marketing campaigns and communications |
| Partner/Third-Party User | partner@kacooperatiba.com | External partner with limited access to specific features |

## Permissions by Role

### Admin / System Administrator
- Full access to all system features
- Can create and manage users
- Can configure system settings
- Can view all reports and data

### Board of Directors
- View financial reports
- Approve high-value loans
- Access to strategic dashboards
- Cannot perform day-to-day operations

### General Manager
- Oversee daily operations
- Access to operational reports
- Approve medium-value loans
- Manage staff and resources

### Credit Officer
- Process loan applications
- Conduct credit assessments
- Manage loan portfolios
- Generate loan reports

### Accountant
- Manage general ledger
- Generate financial statements
- Process journal entries
- Reconcile accounts

### Teller
- Process deposits and withdrawals
- Handle cash transactions
- Manage cash drawer
- Generate transaction receipts

### Compliance Officer
- Conduct internal audits
- Ensure regulatory compliance
- Review policies and procedures
- Generate compliance reports

### Regular Member
- View personal account information
- Apply for loans
- Make deposits and withdrawals
- Update personal information

### Membership Officer
- Process membership applications
- Maintain member records
- Generate membership reports
- Assist with member inquiries

### Security Manager
- Monitor system security
- Review audit logs
- Manage user access
- Investigate security incidents

### Marketing Officer
- Create marketing campaigns
- Send communications to members
- Manage content and promotions
- Track campaign performance

### Partner/Third-Party User
- Limited access to specific features
- View shared data
- Integrate with specific APIs
- Cannot access sensitive information

## How to Use Test Users

1. Run the seeding script to create these users in your development database:
   ```
   node src/scripts/seedTestUsers.js
   ```

2. Log in using the email and password (`Password123!`) for the role you want to test.

3. The system will automatically provide the appropriate permissions and interface based on the user's role.

## Notes for Developers

- These test users are intended for development and testing environments only.
- Do not use these credentials in production.
- All test users have the same password for simplicity, but in a production environment, each user should have a unique, strong password.
- The seeding script checks for existing users to avoid duplicates, so it's safe to run multiple times.

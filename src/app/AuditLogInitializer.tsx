'use client';

import { useEffect } from 'react';
import { initAuditLogRetry } from '@/lib/auditLogger';

/**
 * Component that initializes the audit log retry mechanism.
 * This component should be included in the app layout to ensure
 * that failed audit logs are retried periodically.
 *
 * It handles:
 * 1. Retrying failed audit logs on app initialization
 * 2. Setting up a periodic retry mechanism (every 5 minutes)
 * 3. Ensuring no audit events are lost due to network issues
 */
const AuditLogInitializer: React.FC = () => {
  useEffect(() => {
    // Initialize the audit log retry mechanism
    initAuditLogRetry();

    // No cleanup needed as the interval will be cleaned up when the app is closed
  }, []);

  // This component doesn't render anything
  return null;
};

export default AuditLogInitializer;

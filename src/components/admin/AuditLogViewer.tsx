'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogEntry, AuditActionType } from '@/lib/auditLogger';
import { api } from '@/lib/api';
import { UserRole, roleDisplayNames } from '@/lib/roles';

interface AuditLogViewerProps {
  initialLogs?: AuditLogEntry[];
  userId?: number; // Optional: filter logs for a specific user
  actionTypes?: AuditActionType[]; // Optional: filter by action types
  limit?: number; // Optional: limit number of logs shown
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  initialLogs,
  userId,
  actionTypes,
  limit = 50,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs || []);
  const [isLoading, setIsLoading] = useState(!initialLogs);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [selectedActionTypes, setSelectedActionTypes] = useState<AuditActionType[]>(actionTypes || []);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [targetUserId, setTargetUserId] = useState<number | undefined>(userId);

  // Fetch audit logs
  const fetchLogs = async (pageNum: number = 1, reset: boolean = false) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.getAuditLogs({
        page: pageNum,
        limit,
        actionTypes: selectedActionTypes.length > 0 ? selectedActionTypes : undefined,
        userId: targetUserId,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        searchTerm: searchTerm || undefined,
      });

      const newLogs = response.data.logs || [];

      if (reset) {
        setLogs(newLogs);
      } else {
        setLogs(prev => [...prev, ...newLogs]);
      }

      setHasMore(newLogs.length === limit);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!initialLogs) {
      fetchLogs(1, true);
    }
  }, []);

  // Apply filters
  const applyFilters = () => {
    fetchLogs(1, true);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedActionTypes(actionTypes || []);
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
    setTargetUserId(userId);
    fetchLogs(1, true);
  };

  // Load more logs
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchLogs(page + 1);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get action type display name
  const getActionTypeDisplay = (actionType: AuditActionType) => {
    return actionType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get color for action type
  const getActionTypeColor = (actionType: AuditActionType) => {
    switch (actionType) {
      case AuditActionType.USER_CREATED:
      case AuditActionType.USER_UNLOCKED:
      case AuditActionType.E_WALLET_CREATED:
        return 'bg-green-100 text-green-800';
      case AuditActionType.USER_DELETED:
      case AuditActionType.USER_LOCKED:
        return 'bg-red-100 text-red-800';
      case AuditActionType.USER_UPDATED:
      case AuditActionType.USER_ROLE_CHANGED:
      case AuditActionType.USER_STATUS_CHANGED:
      case AuditActionType.E_WALLET_SETTINGS_CHANGED:
        return 'bg-blue-100 text-blue-800';
      case AuditActionType.USER_PASSWORD_RESET:
      case AuditActionType.SECURITY_SETTING_CHANGED:
        return 'bg-yellow-100 text-yellow-800';
      case AuditActionType.BULK_USERS_IMPORTED:
        return 'bg-purple-100 text-purple-800';
      case AuditActionType.USER_LOGIN:
      case AuditActionType.USER_LOGOUT:
        return 'bg-gray-100 text-gray-800';
      case AuditActionType.DATA_PRIVACY_AGREEMENT_ACCEPTED:
        return 'bg-indigo-100 text-indigo-800';
      case AuditActionType.E_WALLET_TRANSACTION:
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render details based on action type
  const renderDetails = (log: AuditLogEntry) => {
    switch (log.actionType) {
      case AuditActionType.USER_CREATED:
        return (
          <div>
            <p className="text-sm text-gray-600">
              Created via {log.details.creationMethod} with role{' '}
              <span className="font-medium">
                {roleDisplayNames[log.details.userRole as UserRole] || log.details.userRole}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Password setup: {log.details.passwordSetupMethod.replace(/_/g, ' ')}
            </p>
          </div>
        );

      case AuditActionType.USER_ROLE_CHANGED:
        return (
          <p className="text-sm text-gray-600">
            Role changed from{' '}
            <span className="font-medium">
              {roleDisplayNames[log.details.oldRole as UserRole] || log.details.oldRole}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {roleDisplayNames[log.details.newRole as UserRole] || log.details.newRole}
            </span>
          </p>
        );

      case AuditActionType.BULK_USERS_IMPORTED:
        return (
          <div>
            <p className="text-sm text-gray-600">
              Imported {log.details.totalCount} users ({log.details.successCount} successful,{' '}
              {log.details.failureCount} failed)
            </p>
            <p className="text-sm text-gray-600">
              Password setup: {log.details.passwordSetupMethod}
            </p>
            {log.details.userRoles && (
              <div className="mt-1">
                <p className="text-xs text-gray-500">Roles:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(log.details.userRoles).map(([role, count]) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700"
                    >
                      {roleDisplayNames[role as UserRole] || role}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case AuditActionType.USER_UPDATED:
      case AuditActionType.E_WALLET_SETTINGS_CHANGED:
        return (
          <div>
            <p className="text-sm text-gray-600">Changed fields:</p>
            <div className="mt-1 space-y-1">
              {Object.entries(log.details.changes).map(([field, values]: [string, any]) => (
                <p key={field} className="text-xs text-gray-500">
                  <span className="font-medium">{field}:</span>{' '}
                  {typeof values.oldValue === 'object' ? 'Complex object' : values.oldValue} →{' '}
                  {typeof values.newValue === 'object' ? 'Complex object' : values.newValue}
                </p>
              ))}
            </div>
          </div>
        );

      case AuditActionType.DATA_PRIVACY_AGREEMENT_ACCEPTED:
        return (
          <div>
            <p className="text-sm text-gray-600">
              Accepted the <span className="font-medium">{log.details.agreementType}</span> data privacy agreement
            </p>
            <p className="text-xs text-gray-500">
              Timestamp: {new Date(log.details.timestamp).toLocaleString()}
            </p>
          </div>
        );

      case AuditActionType.E_WALLET_CREATED:
        return (
          <div>
            <p className="text-sm text-gray-600">
              Created E-Wallet with ID: <span className="font-medium">{log.details.walletId}</span>
            </p>
            <p className="text-xs text-gray-500">
              Initial balance: {log.details.initialBalance}
            </p>
          </div>
        );

      case AuditActionType.E_WALLET_TRANSACTION:
        return (
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium capitalize">{log.details.transactionType}</span> transaction of{' '}
              <span className="font-medium">{log.details.amount}</span>
            </p>
            {log.details.transactionId && (
              <p className="text-xs text-gray-500">
                Transaction ID: {log.details.transactionId}
              </p>
            )}
            {log.details.recipientName && (
              <p className="text-xs text-gray-500">
                Recipient: {log.details.recipientName} ({log.details.recipientEmail})
              </p>
            )}
            {log.details.description && (
              <p className="text-xs text-gray-500">
                Description: {log.details.description}
              </p>
            )}
          </div>
        );

      default:
        return (
          <p className="text-sm text-gray-600">
            {JSON.stringify(log.details)}
          </p>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action Type Filter */}
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700">
              Action Type
            </label>
            <select
              id="actionType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedActionTypes[0] || ''}
              onChange={(e) => {
                const value = e.target.value as AuditActionType;
                setSelectedActionTypes(value ? [value] : []);
              }}
            >
              <option value="">All Actions</option>
              {Object.values(AuditActionType).map((type) => (
                <option key={type} value={type}>
                  {getActionTypeDisplay(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          {/* Search Term */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Search by email, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Logs</h3>
          <span className="text-sm text-gray-500">
            Showing {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {isLoading && logs.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No audit logs found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {logs.map((log, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionTypeColor(
                          log.actionType
                        )}`}
                      >
                        {getActionTypeDisplay(log.actionType)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {log.performedBy.name} ({log.performedBy.email})
                      </div>
                      {log.targetUser && (
                        <div className="text-sm text-gray-500">
                          Target: {log.targetUser.name || log.targetUser.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>

                <div className="mt-2">
                  {renderDetails(log)}
                </div>

                {log.ipAddress && (
                  <div className="mt-2 text-xs text-gray-400">
                    IP: {log.ipAddress}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogViewer;

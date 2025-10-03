import React from 'react';

interface ConnectionStatusProps {
  isOnline: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ConnectionStatus({ 
  isOnline, 
  error, 
  onRetry,
  className = '' 
}: ConnectionStatusProps) {
  if (isOnline && !error) {
    return null; // Don't show anything when everything is working
  }

  if (!isOnline) {
    return (
      <div className={`flex items-center justify-between p-3 mb-4 bg-orange-50 border border-orange-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-orange-600">📶</div>
          <div>
            <p className="text-sm font-medium text-orange-800">
              Offline Mode
            </p>
            <p className="text-xs text-orange-600">
              Showing cached content
            </p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded hover:bg-orange-200 transition-colors"
          >
            <span>🔄</span>
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-between p-3 mb-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-red-600">⚠️</div>
          <div>
            <p className="text-sm font-medium text-red-800">
              Connection Error
            </p>
            <p className="text-xs text-red-600">
              {error}
            </p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 transition-colors"
          >
            <span>🔄</span>
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}

interface LoadingStateProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingState({ 
  isLoading, 
  message = 'Loading...', 
  className = '' 
}: LoadingStateProps) {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title = 'No data available',
  description = 'There\'s nothing to show here yet.',
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">📄</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

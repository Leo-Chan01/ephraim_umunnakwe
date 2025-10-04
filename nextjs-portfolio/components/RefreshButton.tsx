import React from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  title?: string;
  className?: string;
}

export default function RefreshButton({ 
  onRefresh, 
  isRefreshing, 
  title = "Refresh content",
  className = ""
}: RefreshButtonProps) {
  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-3 py-2 rounded-lg shadow-lg transition-all disabled:opacity-50 backdrop-blur-sm border border-white/20 text-sm"
        title={title}
      >
        {isRefreshing ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          '↻'
        )}
      </button>
    </div>
  );
}

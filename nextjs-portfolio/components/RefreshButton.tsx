import React from 'react';
import { RefreshCw } from 'lucide-react';

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
    <div className={`fixed top-24 right-6 z-40 ${className}`}>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-neutral-900 border-4 border-neutral-900 dark:border-accent text-white px-6 py-3 hover:bg-transparent hover:text-neutral-900 dark:hover:text-accent transition-all disabled:opacity-50 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]"
        title={title}
      >
        {isRefreshing ? (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <RefreshCw size={14} className="text-accent" />
        )}
        <span>{isRefreshing ? 'SYNCING...' : 'SYNC DATA'}</span>
      </button>
    </div>
  );
}

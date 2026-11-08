import React from 'react';
import { ChevronRight, ArrowLeft, ArrowUp, RefreshCw, Home } from 'lucide-react';
import { formatBytes } from '../utils/fileUtils.ts';

interface BreadcrumbProps {
  path: { id: string | null; name: string }[];
  onNavigate: (folderId: string | null) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  totalItems: number;
  totalBytes: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
  onGoBack,
  canGoBack,
  totalItems,
  totalBytes,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="h-10 px-4 bg-slate-50/60 border-b border-slate-200/60 flex items-center justify-between text-xs select-none">
      {/* Left Path Items */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {canGoBack && (
          <button
            onClick={onGoBack}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition mr-1"
            title="Quay lại thư mục trước"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-1 text-slate-600">
          {path.map((item, index) => {
            const isLast = index === path.length - 1;
            return (
              <React.Fragment key={item.id ?? 'root'}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {item.name}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-[#06a7ff] hover:underline transition truncate max-w-[150px] flex items-center gap-1"
                  >
                    {index === 0 && <Home className="w-3 h-3 text-slate-400" />}
                    <span>{item.name}</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Right stats and refresh */}
      <div className="flex items-center gap-3 shrink-0 text-slate-400 font-mono text-[11px]">
        <span>
          Đã tải <strong className="text-slate-600 font-sans">{totalItems}</strong> mục ({formatBytes(totalBytes)})
        </span>
        <button
          onClick={onRefresh}
          className={`p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition ${
            isRefreshing ? 'animate-spin text-[#06a7ff]' : ''
          }`}
          title="Làm mới danh sách"
          aria-label="Làm mới"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

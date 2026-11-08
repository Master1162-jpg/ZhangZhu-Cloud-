import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FolderPlus,
  CloudDownload,
  Download,
  Share2,
  Trash2,
  Edit2,
  FolderInput,
  Copy,
  Shield,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Check,
  ChevronDown,
  FileUp,
  FolderUp,
  Sparkles,
} from 'lucide-react';
import { ViewMode, SortField, SortOrder } from '../types/drive.ts';

interface ToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onOpenUpload: (type: 'file' | 'folder') => void;
  onOpenNewFolder: () => void;
  onOpenOfflineDownload: () => void;
  onDownloadSelected: () => void;
  onShareSelected: () => void;
  onDeleteSelected: () => void;
  onRenameSelected: () => void;
  onMoveSelected: () => void;
  onCopySelected: () => void;
  onSafeBoxSelected: () => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  isTrashView?: boolean;
  onEmptyTrash?: () => void;
  onRestoreSelected?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  onClearSelection,
  onOpenUpload,
  onOpenNewFolder,
  onOpenOfflineDownload,
  onDownloadSelected,
  onShareSelected,
  onDeleteSelected,
  onRenameSelected,
  onMoveSelected,
  onCopySelected,
  onSafeBoxSelected,
  viewMode,
  onToggleViewMode,
  sortField,
  sortOrder,
  onSortChange,
  isTrashView = false,
  onEmptyTrash,
  onRestoreSelected,
}) => {
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target as Node)) {
        setShowUploadDropdown(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions: { label: string; field: SortField; order: SortOrder }[] = [
    { label: 'Tên tệp (A - Z)', field: 'name', order: 'asc' },
    { label: 'Tên tệp (Z - A)', field: 'name', order: 'desc' },
    { label: 'Thời gian sửa đổi (Mới nhất)', field: 'updatedAt', order: 'desc' },
    { label: 'Thời gian sửa đổi (Cũ nhất)', field: 'updatedAt', order: 'asc' },
    { label: 'Kích thước (Lớn nhất)', field: 'size', order: 'desc' },
    { label: 'Kích thước (Nhỏ nhất)', field: 'size', order: 'asc' },
  ];

  return (
    <div className="h-13 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left side actions */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {selectedCount === 0 ? (
          // Default State: Upload & Create Actions
          <>
            {isTrashView ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onEmptyTrash}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Dọn sạch thùng rác</span>
                </button>
              </div>
            ) : (
              <>
                {/* Upload Button with Dropdown (Baidu style solid blue) */}
                <div className="relative" ref={uploadMenuRef}>
                  <div className="inline-flex rounded-lg shadow-sm">
                    <button
                      onClick={() => onOpenUpload('file')}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#06a7ff] hover:bg-[#0092e0] active:bg-[#007ec2] text-white text-xs font-semibold rounded-l-lg transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải lên</span>
                    </button>
                    <button
                      onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                      className="px-2 py-1.5 bg-[#06a7ff] hover:bg-[#0092e0] active:bg-[#007ec2] text-white border-l border-blue-400 rounded-r-lg transition cursor-pointer"
                      aria-label="Tùy chọn tải lên"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {showUploadDropdown && (
                    <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-700">
                      <button
                        onClick={() => {
                          setShowUploadDropdown(false);
                          onOpenUpload('file');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-100 transition text-left"
                      >
                        <FileUp className="w-4 h-4 text-blue-500" />
                        <span>Tải tệp lên</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUploadDropdown(false);
                          onOpenUpload('folder');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-100 transition text-left"
                      >
                        <FolderUp className="w-4 h-4 text-amber-500" />
                        <span>Tải thư mục lên</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* New Folder */}
                <button
                  onClick={onOpenNewFolder}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tạo thư mục</span>
                </button>

                {/* Offline Download */}
                <button
                  onClick={onOpenOfflineDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  <CloudDownload className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tải ngoại tuyến</span>
                </button>
              </>
            )}
          </>
        ) : (
          // Selected Items State: Batch Operations Toolbar
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 bg-blue-50 text-[#06a7ff] px-2.5 py-1 rounded-md border border-blue-100">
              Đã chọn {selectedCount} mục
            </span>

            {isTrashView ? (
              <>
                <button
                  onClick={onRestoreSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Khôi phục</span>
                </button>
                <button
                  onClick={onDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa vĩnh viễn</span>
                </button>
              </>
            ) : (
              <>
                {/* Download (with VIP speed indicator) */}
                <button
                  onClick={onDownloadSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06a7ff] hover:bg-[#0092e0] text-white text-xs font-semibold rounded-lg transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải xuống (极速)</span>
                </button>

                {/* Share */}
                <button
                  onClick={onShareSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Chia sẻ</span>
                </button>

                {/* Delete */}
                <button
                  onClick={onDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>

                {/* Rename (only if single selection) */}
                {selectedCount === 1 && (
                  <button
                    onClick={onRenameSelected}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Đổi tên</span>
                  </button>
                )}

                {/* Move */}
                <button
                  onClick={onMoveSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <FolderInput className="w-3.5 h-3.5 text-slate-600" />
                  <span>Di chuyển</span>
                </button>

                {/* Copy */}
                <button
                  onClick={onCopySelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sao chép</span>
                </button>

                {/* Safe Box */}
                <button
                  onClick={onSafeBoxSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold rounded-lg transition"
                  title="Di chuyển vào két sắt mã hóa bí mật"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Khóa an toàn</span>
                </button>
              </>
            )}

            <button
              onClick={onClearSelection}
              className="text-xs text-slate-500 hover:text-slate-800 ml-1 px-2 py-1 rounded hover:bg-slate-100"
            >
              Hủy chọn
            </button>
          </div>
        )}
      </div>

      {/* Right controls: Sort & View Mode Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Sắp xếp tệp"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sắp xếp</span>
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-700">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                Tiêu chí sắp xếp
              </div>
              {sortOptions.map((opt, idx) => {
                const isActive = sortField === opt.field && sortOrder === opt.order;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSortChange(opt.field, opt.order);
                      setShowSortDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-100 transition text-left"
                  >
                    <span>{opt.label}</span>
                    {isActive && <Check className="w-4 h-4 text-[#06a7ff]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* View Mode Toggle: List vs Grid */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
          <button
            onClick={() => onToggleViewMode('list')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'list'
                ? 'bg-white text-[#06a7ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Dạng danh sách"
            aria-label="Hiển thị dạng danh sách"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleViewMode('grid')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'grid'
                ? 'bg-white text-[#06a7ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Dạng lưới biểu tượng"
            aria-label="Hiển thị dạng lưới"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

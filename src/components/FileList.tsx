import React from 'react';
import {
  Share2,
  Download,
  Trash2,
  MoreHorizontal,
  Folder,
  Eye,
  FileQuestion,
  Sparkles,
  Lock,
} from 'lucide-react';
import { DriveItem, ViewMode } from '../types/drive.ts';
import { FileTypeIcon } from './Icons.tsx';
import { formatBytes } from '../utils/fileUtils.ts';

interface FileListProps {
  items: DriveItem[];
  viewMode: ViewMode;
  selectedIds: Set<string>;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onItemClick: (item: DriveItem) => void;
  onItemDoubleClick: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  onDownloadItem: (item: DriveItem) => void;
  onDeleteItem: (item: DriveItem) => void;
  onRenameItem: (item: DriveItem) => void;
  onSafeBoxItem: (item: DriveItem) => void;
}

export const FileList: React.FC<FileListProps> = ({
  items,
  viewMode,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onItemClick,
  onItemDoubleClick,
  onShareItem,
  onDownloadItem,
  onDeleteItem,
  onRenameItem,
  onSafeBoxItem,
}) => {
  const isAllSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id));
  const isPartialSelected = items.some((it) => selectedIds.has(it.id)) && !isAllSelected;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return isoStr;
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center select-none">
        <div className="w-24 h-24 mb-4 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-400">
          <Folder className="w-12 h-12 stroke-1" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          Thư mục này hiện đang trống
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Hãy tải tệp lên hoặc sử dụng tính năng tải ngoại tuyến để nạp dữ liệu vào ZhangZhu Drive
        </p>
      </div>
    );
  }

  // LIST VIEW (Classic Baidu Netdisk Table)
  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-y-auto select-none">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-400 font-medium h-9 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <th className="w-10 px-4 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartialSelected;
                  }}
                  onChange={() => {
                    if (isAllSelected) onClearSelection();
                    else onSelectAll();
                  }}
                  className="rounded border-slate-300 text-[#06a7ff] focus:ring-[#06a7ff] cursor-pointer"
                  aria-label="Chọn tất cả các tệp"
                />
              </th>
              <th className="font-semibold py-2">Tên tệp</th>
              <th className="font-semibold py-2 w-32 hidden md:table-cell">Kích thước</th>
              <th className="font-semibold py-2 w-44 hidden sm:table-cell">Thời gian sửa đổi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                      onItemClick(item);
                    }
                  }}
                  onDoubleClick={() => onItemDoubleClick(item)}
                  className={`group h-12 transition cursor-pointer ${
                    isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onToggleSelect(item.id, e as unknown as React.MouseEvent)}
                      className="rounded border-slate-300 text-[#06a7ff] focus:ring-[#06a7ff] cursor-pointer"
                      aria-label={`Chọn tệp ${item.name}`}
                    />
                  </td>

                  {/* Name + Icon + Inline Hover Actions */}
                  <td className="py-2 pr-4 font-normal">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <FileTypeIcon
                          extension={item.extension}
                          isFolder={item.isFolder}
                          category={item.category}
                          className="w-7 h-7"
                        />
                        <span
                          className={`truncate text-xs ${
                            item.isFolder
                              ? 'font-medium text-slate-800 hover:text-[#06a7ff]'
                              : 'text-slate-700'
                          }`}
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        {item.resolution && (
                          <span className="shrink-0 px-1 py-0.2 text-[9px] font-bold text-amber-700 bg-amber-100 rounded">
                            {item.resolution}
                          </span>
                        )}
                        {item.isSafeBox && (
                          <span className="shrink-0 px-1 py-0.2 text-[9px] font-bold text-indigo-700 bg-indigo-100 rounded flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            Két sắt
                          </span>
                        )}
                      </div>

                      {/* Hover action bar (Very iconic Baidu Wangpan table behavior!) */}
                      <div
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onItemDoubleClick(item)}
                          className="p-1.5 text-slate-500 hover:text-[#06a7ff] hover:bg-white rounded transition shadow-xs"
                          title="Xem trước"
                          aria-label="Xem trước tệp"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onShareItem(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-500 hover:bg-white rounded transition shadow-xs"
                          title="Chia sẻ liên kết"
                          aria-label="Chia sẻ tệp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDownloadItem(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-500 hover:bg-white rounded transition shadow-xs"
                          title="Tải xuống tốc độ cực hạn"
                          aria-label="Tải xuống tệp"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-white rounded transition shadow-xs"
                          title="Xóa tệp"
                          aria-label="Xóa tệp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Size */}
                  <td className="py-2 text-slate-500 font-mono hidden md:table-cell">
                    {item.isFolder ? '-' : formatBytes(item.size)}
                  </td>

                  {/* Updated At */}
                  <td className="py-2 text-slate-400 font-mono hidden sm:table-cell">
                    {formatDate(item.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // GRID VIEW (Thumbnail cards)
  return (
    <div className="flex-1 overflow-y-auto p-4 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              onDoubleClick={() => onItemDoubleClick(item)}
              className={`group relative flex flex-col items-center p-3 rounded-2xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/80 border-[#06a7ff] shadow-sm'
                  : 'bg-white border-slate-200/70 hover:border-blue-200 hover:shadow-md'
              }`}
            >
              {/* Checkbox top-left corner */}
              <div
                className={`absolute top-2 left-2 transition ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onToggleSelect(item.id, e as unknown as React.MouseEvent)}
                  className="rounded border-slate-300 text-[#06a7ff] focus:ring-[#06a7ff] cursor-pointer"
                  aria-label={`Chọn ${item.name}`}
                />
              </div>

              {/* Main Visual or Thumbnail */}
              <div className="w-full aspect-square max-h-28 mb-2 flex items-center justify-center rounded-xl bg-slate-50 overflow-hidden relative">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <FileTypeIcon
                    extension={item.extension}
                    isFolder={item.isFolder}
                    category={item.category}
                    className={item.isFolder ? 'w-14 h-14' : 'w-12 h-12'}
                  />
                )}

                {/* Duration or resolution badge */}
                {item.duration && (
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[9px] font-mono font-bold text-white bg-black/60 rounded">
                    {item.duration}
                  </span>
                )}
                {item.resolution && (
                  <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] font-bold text-white bg-amber-500 rounded">
                    4K
                  </span>
                )}
              </div>

              {/* Title & Size */}
              <div className="w-full text-center">
                <p
                  className={`text-xs truncate font-medium ${
                    item.isFolder
                      ? 'text-slate-800 group-hover:text-[#06a7ff]'
                      : 'text-slate-700'
                  }`}
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.isFolder ? 'Thư mục' : formatBytes(item.size)}
                </p>
              </div>

              {/* Quick Actions overlay on hover */}
              <div
                className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-100 py-1 px-2 flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onItemDoubleClick(item)}
                  className="p-1 text-slate-500 hover:text-[#06a7ff] rounded"
                  title="Xem trước"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onShareItem(item)}
                  className="p-1 text-slate-500 hover:text-sky-500 rounded"
                  title="Chia sẻ"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDownloadItem(item)}
                  className="p-1 text-slate-500 hover:text-emerald-500 rounded"
                  title="Tải xuống"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteItem(item)}
                  className="p-1 text-slate-500 hover:text-rose-500 rounded"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

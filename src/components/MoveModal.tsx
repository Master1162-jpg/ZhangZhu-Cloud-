import React, { useState } from 'react';
import { X, FolderInput, Folder, ChevronRight, Check } from 'lucide-react';
import { DriveItem } from '../types/drive.ts';

interface MoveModalProps {
  selectedItems: DriveItem[];
  folders: DriveItem[];
  currentFolderId: string | null;
  mode: 'move' | 'copy';
  onClose: () => void;
  onConfirm: (targetFolderId: string | null) => void;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  selectedItems,
  folders,
  currentFolderId,
  mode,
  onClose,
  onConfirm,
}) => {
  const [targetId, setTargetId] = useState<string | null>(null);

  // Exclude selected folders and their children to prevent moving folder into itself
  const selectedFolderIds = new Set(selectedItems.filter((i) => i.isFolder).map((i) => i.id));
  const validFolders = folders.filter((f) => !selectedFolderIds.has(f.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        <div className="h-12 px-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderInput className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-800">
              {mode === 'move' ? 'Di chuyển đến thư mục' : 'Sao chép đến thư mục'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs text-slate-500 mb-3">
            Chọn thư mục đích để {mode === 'move' ? 'chuyển' : 'sao chép'}{' '}
            <strong>{selectedItems.length}</strong> mục đã chọn:
          </p>

          <div className="border border-slate-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-slate-100 mb-4 text-xs">
            {/* Root folder option */}
            <div
              onClick={() => setTargetId(null)}
              className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                targetId === null ? 'bg-blue-50 text-[#06a7ff] font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-500" />
                <span>Thư mục gốc (Tất cả tệp)</span>
              </span>
              {targetId === null && <Check className="w-4 h-4 text-[#06a7ff]" />}
            </div>

            {/* Folder list */}
            {validFolders.map((folder) => {
              const isSelected = targetId === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => setTargetId(folder.id)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-blue-50 text-[#06a7ff] font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Folder className="w-4 h-4 text-amber-500" />
                    <span className="truncate">{folder.name}</span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#06a7ff]" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(targetId);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#06a7ff] hover:bg-[#0092e0] rounded-xl transition shadow-xs"
            >
              {mode === 'move' ? 'Di chuyển vào đây' : 'Sao chép vào đây'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

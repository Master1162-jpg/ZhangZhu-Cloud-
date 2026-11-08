import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  FilePlus,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { DriveItem } from '../types/drive.ts';
import { FileList } from './FileList.tsx';

interface SafeBoxViewProps {
  safeItems: DriveItem[];
  onUnlock: () => void;
  isUnlocked: boolean;
  onLock: () => void;
  onRemoveFromSafeBox: (item: DriveItem) => void;
  onPreviewItem: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  onDownloadItem: (item: DriveItem) => void;
  onDeleteItem: (item: DriveItem) => void;
}

export const SafeBoxView: React.FC<SafeBoxViewProps> = ({
  safeItems,
  onUnlock,
  isUnlocked,
  onLock,
  onRemoveFromSafeBox,
  onPreviewItem,
  onShareItem,
  onDownloadItem,
  onDeleteItem,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const correctPin = '123456';

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');

      if (newPin.length === 6) {
        if (newPin === correctPin) {
          onUnlock();
          setPin('');
        } else {
          setErrorMsg('Mã PIN không đúng! (Gợi ý dùng thử: 123456)');
          setTimeout(() => setPin(''), 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  if (!isUnlocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 select-none">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl border border-slate-200/80 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-base font-bold text-slate-800 mb-1">
            Không Gian An Toàn (密码箱)
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Nhập mã PIN 6 chữ số để truy cập các tài liệu mật được mã hóa
          </p>

          {/* PIN Dots Indicator */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const filled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    filled
                      ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-sm'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                />
              );
            })}
          </div>

          {errorMsg && (
            <div className="mb-4 text-xs text-rose-500 font-medium animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-lg transition active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPin('123456');
                onUnlock();
              }}
              className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 text-[11px] text-indigo-500 font-semibold transition active:scale-95 flex items-center justify-center px-1"
              title="Điền tự động mã PIN mẫu"
            >
              Mã mẫu
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-lg transition active:scale-95 flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-sm font-semibold transition active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label="Xóa số"
            >
              ⌫
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Mã PIN mặc định trải nghiệm: <span className="font-mono font-bold text-indigo-600">123456</span>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Banner when safe box is unlocked */}
      <div className="h-12 px-5 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-indigo-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Két sắt bảo mật đã mở khóa ({safeItems.length} tệp được bảo vệ)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Khóa két sắt ngay</span>
          </button>
        </div>
      </div>

      <FileList
        items={safeItems}
        viewMode="list"
        selectedIds={new Set()}
        onToggleSelect={() => {}}
        onSelectAll={() => {}}
        onClearSelection={() => {}}
        onItemClick={onPreviewItem}
        onItemDoubleClick={onPreviewItem}
        onShareItem={onShareItem}
        onDownloadItem={onDownloadItem}
        onDeleteItem={onDeleteItem}
        onRenameItem={() => {}}
        onSafeBoxItem={onRemoveFromSafeBox}
      />
    </div>
  );
};

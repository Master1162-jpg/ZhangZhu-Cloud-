import React, { useState } from 'react';
import {
  Search,
  X,
  Crown,
  ArrowDownToLine,
  HelpCircle,
  Bell,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  HardDrive,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { ZhangZhuLogo } from './Icons.tsx';
import { DriveUser, TransferTask } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: DriveUser;
  transferTasks: TransferTask[];
  onOpenTransferCenter: () => void;
  onOpenOfflineDownload: () => void;
  onOpenExtractLink: () => void;
  onOpenVipModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  user,
  transferTasks,
  onOpenTransferCenter,
  onOpenOfflineDownload,
  onOpenExtractLink,
  onOpenVipModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showClientQR, setShowClientQR] = useState(false);

  const activeTransferCount = transferTasks.filter((t) => t.status === 'running').length;

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0 select-none z-30 sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-6">
        <ZhangZhuLogo className="w-8 h-8" />
      </div>

      {/* Center: Search Box (Iconic Baidu Netdisk Pill Input) */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm tệp, thư mục trong ZhangZhu Drive..."
            className="w-full h-9 pl-9 pr-8 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder:text-slate-400 rounded-full border border-transparent focus:border-[#06a7ff] focus:ring-2 focus:ring-[#06a7ff]/20 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Tools & Account */}
      <div className="flex items-center gap-2 text-slate-600">
        {/* Quick Extract Shared Link */}
        <button
          onClick={onOpenExtractLink}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 rounded-full transition"
          title="Nhập liên kết chia sẻ kèm mã trích xuất để nạp vào đĩa"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#06a7ff]" />
          <span>Nhập link chia sẻ</span>
        </button>

        {/* Offline Download Quick Trigger */}
        <button
          onClick={onOpenOfflineDownload}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 rounded-full transition"
          title="Dán link HTTP / Magnet để tải ngoại tuyến về đám mây"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tải ngoại tuyến</span>
        </button>

        {/* Transfer Task Center Button */}
        <button
          onClick={onOpenTransferCenter}
          className="relative p-2 text-slate-600 hover:text-[#06a7ff] hover:bg-slate-100 rounded-lg transition"
          title="Danh sách truyền tải tệp (Upload / Download)"
          aria-label="Danh sách truyền tải tệp"
        >
          <ArrowDownToLine className="w-4 h-4" />
          {activeTransferCount > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 text-[10px] font-bold text-white bg-[#06a7ff] rounded-full flex items-center justify-center">
              {activeTransferCount}
            </span>
          )}
        </button>

        {/* SVIP Member Badge Button (High-profile gold button like Baidu SVIP) */}
        <button
          onClick={onOpenVipModal}
          className="relative flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 rounded-full font-bold text-xs shadow-sm hover:shadow transition cursor-pointer"
          title="Đặc quyền ZhangZhu SVIP: Tốc độ cực hạn, dung lượng 10TB, xem 4K"
        >
          <Crown className="w-3.5 h-3.5 fill-current text-slate-950" />
          <span className="tracking-tight text-[11px]">SVIP SIÊU CẤP</span>
        </button>

        {/* Mobile App QR popover toggle */}
        <div className="relative">
          <button
            onClick={() => setShowClientQR(!showClientQR)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Tải ứng dụng ZhangZhu Drive cho Điện thoại & Máy tính"
            aria-label="Tải ứng dụng di động"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          {showClientQR && (
            <div className="absolute right-0 mt-2 w-56 p-4 bg-white rounded-xl shadow-xl border border-slate-200 z-50 text-center animate-in fade-in slide-in-from-top-2">
              <div className="w-32 h-32 mx-auto bg-slate-100 rounded-lg border-2 border-dashed border-[#06a7ff]/50 flex items-center justify-center p-2 mb-2">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zhangzhu.drive/mobile"
                  alt="QR Download ZhangZhu Drive"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-slate-800">Quét để tải ZhangZhu App</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Hỗ trợ iOS, Android, Windows & Mac</p>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#06a7ff]/40 transition"
            aria-label="Menu tài khoản"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center text-[7px] font-black text-slate-900 border border-white">
                V
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <span className="px-1.5 py-0.2 text-[10px] font-bold text-amber-900 bg-amber-300 rounded font-mono">
                      SVIP8
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">Hạn dùng: {user.vipExpireDate}</p>
                </div>
              </div>

              {/* Storage Info */}
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    Dung lượng
                  </span>
                  <span className="text-slate-800 font-semibold font-mono">
                    {formatBytes(user.usedBytes)} / {formatBytes(user.totalBytes)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-[#06a7ff] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (user.usedBytes / user.totalBytes) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Action buttons inside user menu */}
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenVipModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-amber-900 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-lg transition border border-amber-200"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Đặc quyền tài khoản SVIP
                  </span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                    Quản lý
                  </span>
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Đã đồng bộ bảo mật 2 lớp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Folder,
  Image,
  FileText,
  Film,
  Music,
  Archive,
  MoreHorizontal,
  CloudDownload,
  ShieldCheck,
  Share2,
  Trash2,
  HardDrive,
  Crown,
  Laptop,
} from 'lucide-react';
import { FileCategory, DriveUser } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';

interface SidebarProps {
  currentCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  activeView: 'drive' | 'offline' | 'safebox' | 'shares' | 'trash';
  onSelectView: (view: 'drive' | 'offline' | 'safebox' | 'shares' | 'trash') => void;
  user: DriveUser;
  onOpenVipModal: () => void;
  itemCounts: {
    all: number;
    picture: number;
    document: number;
    video: number;
    audio: number;
    archive: number;
    other: number;
    trash: number;
    safebox: number;
    shares: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  activeView,
  onSelectView,
  user,
  onOpenVipModal,
  itemCounts,
}) => {
  const categoryItems: { id: FileCategory; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'Tất cả tệp', icon: <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />, count: itemCounts.all },
    { id: 'picture', label: 'Hình ảnh', icon: <Image className="w-4 h-4 text-emerald-500" />, count: itemCounts.picture },
    { id: 'document', label: 'Tài liệu', icon: <FileText className="w-4 h-4 text-blue-500" />, count: itemCounts.document },
    { id: 'video', label: 'Video', icon: <Film className="w-4 h-4 text-purple-500" />, count: itemCounts.video },
    { id: 'audio', label: 'Âm nhạc', icon: <Music className="w-4 h-4 text-rose-500" />, count: itemCounts.audio },
    { id: 'archive', label: 'Tệp nén', icon: <Archive className="w-4 h-4 text-orange-500" />, count: itemCounts.archive },
    { id: 'other', label: 'Khác', icon: <MoreHorizontal className="w-4 h-4 text-slate-400" />, count: itemCounts.other },
  ];

  return (
    <aside className="w-56 bg-[#f7f9fc] border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none text-slate-700 h-[calc(100vh-3.5rem)]">
      {/* Top Nav Lists */}
      <div className="p-3 space-y-6 overflow-y-auto">
        {/* Main Drive Categories */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tập Tin Của Tôi
          </div>
          <nav className="space-y-0.5">
            {categoryItems.map((item) => {
              const isSelected = activeView === 'drive' && currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView('drive');
                    onSelectCategory(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                    isSelected
                      ? 'bg-blue-50 text-[#06a7ff] font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-blue-100 text-[#06a7ff]'
                        : 'text-slate-400 bg-slate-200/50'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cloud Tools & Features */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Công Cụ Đám Mây
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectView('offline')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                activeView === 'offline'
                  ? 'bg-blue-50 text-[#06a7ff] font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CloudDownload className="w-4 h-4 text-emerald-500" />
                <span>Tải ngoại tuyến</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-md">
                P2P
              </span>
            </button>

            <button
              onClick={() => onSelectView('safebox')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                activeView === 'safebox'
                  ? 'bg-blue-50 text-[#06a7ff] font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Không gian an toàn</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full text-slate-400 bg-slate-200/50">
                {itemCounts.safebox}
              </span>
            </button>

            <button
              onClick={() => onSelectView('shares')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                activeView === 'shares'
                  ? 'bg-blue-50 text-[#06a7ff] font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-sky-500" />
                <span>Chia sẻ của tôi</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full text-slate-400 bg-slate-200/50">
                {itemCounts.shares}
              </span>
            </button>

            <button
              onClick={() => onSelectView('trash')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition ${
                activeView === 'trash'
                  ? 'bg-blue-50 text-[#06a7ff] font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Thùng rác</span>
              </span>
              {itemCounts.trash > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full text-rose-600 bg-rose-100 font-semibold">
                  {itemCounts.trash}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Storage Quota Card */}
      <div className="p-3 border-t border-slate-200/80 bg-white/70">
        <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#06a7ff]" />
              <span>Dung lượng</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {Math.round((user.usedBytes / user.totalBytes) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-[#06a7ff] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (user.usedBytes / user.totalBytes) * 100)}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex justify-between">
            <span>{formatBytes(user.usedBytes)}</span>
            <span>{formatBytes(user.totalBytes)}</span>
          </div>

          <button
            onClick={onOpenVipModal}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 fill-slate-900" />
            <span>Nâng cấp 10 TB SVIP</span>
          </button>
        </div>

        {/* Client App Download link */}
        <div className="mt-2 text-center">
          <a
            href="#download-client"
            onClick={(e) => {
              e.preventDefault();
              alert('ZhangZhu Drive hỗ trợ ứng dụng trên Windows, Mac, iOS và Android!');
            }}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#06a7ff] transition"
          >
            <Laptop className="w-3 h-3" />
            <span>Tải ứng dụng máy tính</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

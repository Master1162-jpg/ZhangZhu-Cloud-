import React from 'react';

// ZhangZhu Drive Logo: Iconic Bamboo Cloud Emblem
export const ZhangZhuLogo: React.FC<{ className?: string; showSub?: boolean }> = ({
  className = 'w-8 h-8',
  showSub = true,
}) => (
  <div className="flex items-center gap-2.5 select-none">
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#0066ff] via-[#06a7ff] to-[#00d2ff] shadow-md shadow-blue-500/25 ${className}`}>
      {/* Cloud & Bamboo Stylized SVG */}
      <svg viewBox="0 0 36 36" fill="none" className="w-4/5 h-4/5 drop-shadow-sm">
        <path
          d="M26 19.5c0-3.3-2.7-6-6-6-.5 0-1 .07-1.47.2C17.2 10.9 14.3 9 11 9 6.6 9 3 12.6 3 17c0 .5.05 1 .15 1.5C1.3 19.3 0 21 0 23c0 2.8 2.2 5 5 5h21c2.8 0 5-2.2 5-5 0-1.7-.8-3.2-2.1-4.1.06-.46.1-.92.1-1.4z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Bamboo Leaf Accent */}
        <path
          d="M21 9c3.5 0 8 3 8 8s-5 4-8 1c0 0 3-4 0-9z"
          fill="#34d399"
          fillOpacity="0.9"
        />
        <path
          d="M23 15c2 0 5 1.5 5 4s-3 2-5 .5c0 0 1.8-2 0-4.5z"
          fill="#10b981"
        />
      </svg>
      {/* Little glow dot */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-white rounded-full shadow-xs" />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-lg font-bold tracking-tight text-slate-800 font-sans">
          ZhangZhu
        </span>
        <span className="text-lg font-semibold text-[#06a7ff] font-sans">
          Drive
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded font-mono">
          网盘
        </span>
      </div>
      {showSub && (
        <span className="text-[10px] text-slate-400 font-medium tracking-wide">
          掌竹网盘 · Lưu Trữ Tốc Độ Cao
        </span>
      )}
    </div>
  </div>
);

// File icon visualizer resembling authentic Baidu Netdisk icon style
export const FileTypeIcon: React.FC<{
  extension?: string;
  isFolder?: boolean;
  category?: string;
  className?: string;
}> = ({ extension = '', isFolder = false, category = 'other', className = 'w-9 h-9' }) => {
  if (isFolder) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Baidu-style warm yellow folder with glossy gradient */}
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm">
          <path
            d="M6 10a4 4 0 014-4h8.8a4 4 0 012.8 1.2L24.8 10H40a4 4 0 014 4v22a4 4 0 01-4 4H8a4 4 0 01-4-4V10z"
            fill="url(#folderBack)"
          />
          <path
            d="M4 16a3 3 0 013-3h34a3 3 0 013 3v20a4 4 0 01-4 4H8a4 4 0 01-4-4V16z"
            fill="url(#folderFront)"
          />
          <path
            d="M6 14h36"
            stroke="#ffeb80"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="folderBack" x1="6" y1="6" x2="44" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="folderFront" x1="4" y1="13" x2="44" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCD34D" />
              <stop offset="0.6" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  const ext = extension.toLowerCase();

  // Video files
  if (['mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv'].includes(ext) || category === 'video') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-sm ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity="0.3" />
        </svg>
        <span className="absolute bottom-0.5 right-0.5 text-[8px] uppercase font-mono px-0.5 rounded bg-black/40">
          {ext.slice(0, 3) || 'MP4'}
        </span>
      </div>
    );
  }

  // Audio files
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext) || category === 'audio') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold shadow-sm ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.4" />
          <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.4" />
        </svg>
        <span className="absolute bottom-0.5 right-0.5 text-[8px] uppercase font-mono px-0.5 rounded bg-black/40">
          {ext.slice(0, 4) || 'AUD'}
        </span>
      </div>
    );
  }

  // Picture files
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || category === 'picture') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-bold shadow-sm ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="absolute bottom-0.5 right-0.5 text-[8px] uppercase font-mono px-0.5 rounded bg-black/40">
          {ext.slice(0, 3) || 'IMG'}
        </span>
      </div>
    );
  }

  // PDF
  if (ext === 'pdf') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-sm ${className}`}>
        <span className="text-[11px] font-black tracking-tighter">PDF</span>
      </div>
    );
  }

  // Word doc
  if (['doc', 'docx'].includes(ext)) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-sm ${className}`}>
        <span className="text-[12px] font-black">W</span>
        <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono opacity-80">DOC</span>
      </div>
    );
  }

  // Excel
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 text-white font-bold shadow-sm ${className}`}>
        <span className="text-[12px] font-black">X</span>
        <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono opacity-80">XLS</span>
      </div>
    );
  }

  // PowerPoint
  if (['ppt', 'pptx'].includes(ext)) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 text-white font-bold shadow-sm ${className}`}>
        <span className="text-[12px] font-black">P</span>
        <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono opacity-80">PPT</span>
      </div>
    );
  }

  // Archive
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || category === 'archive') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white font-bold shadow-sm ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
        <span className="absolute bottom-0.5 right-0.5 text-[8px] uppercase font-mono px-0.5 rounded bg-black/40">
          ZIP
        </span>
      </div>
    );
  }

  // Code / text / default
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold shadow-sm ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      {ext && (
        <span className="absolute bottom-0.5 right-0.5 text-[7px] uppercase font-mono px-0.5 rounded bg-black/40">
          {ext.slice(0, 3)}
        </span>
      )}
    </div>
  );
};

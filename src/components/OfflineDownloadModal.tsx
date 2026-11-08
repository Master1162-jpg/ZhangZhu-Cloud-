import React, { useState } from 'react';
import {
  X,
  CloudDownload,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getFileCategory } from '../utils/fileUtils.ts';

interface OfflineDownloadModalProps {
  currentFolderId: string | null;
  onClose: () => void;
  onStartOfflineTask: (name: string, size: number, category: any) => void;
}

export const OfflineDownloadModal: React.FC<OfflineDownloadModalProps> = ({
  currentFolderId,
  onClose,
  onStartOfflineTask,
}) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const sampleLinks = [
    { label: 'Ubuntu 24.04 ISO (Direct HTTP)', url: 'https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso' },
    { label: 'Blender 4.2 Studio (Magnet P2P)', url: 'magnet:?xt=urn:btih:3b8c4d8e5f...&dn=Blender_4.2_LTS.zip' },
    { label: 'Nature 4K Footage (Direct MP4)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  ];

  const handleStart = () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      let fileName = 'Tap_Tin_Tai_Ngoai_Tuyen.zip';
      let size = 1024 * 1024 * 750;

      if (url.includes('.iso')) {
        fileName = 'ubuntu-24.04-desktop-amd64.iso';
        size = 1024 * 1024 * 1024 * 4.8;
      } else if (url.includes('.mp4')) {
        fileName = 'Nature_4K_HDR_Showcase.mp4';
        size = 1024 * 1024 * 850;
      } else if (url.includes('Blender')) {
        fileName = 'Blender_4.2_LTS_Official.zip';
        size = 1024 * 1024 * 340;
      } else {
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1]?.split('?')[0];
        if (lastPart && lastPart.length > 3) {
          fileName = decodeURIComponent(lastPart);
        }
      }

      const cat = getFileCategory(fileName);
      onStartOfflineTask(fileName, size, cat);
      setIsAnalyzing(false);
      setDownloadSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        <div className="h-14 px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CloudDownload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Tải ngoại tuyến (离线下载)</h3>
              <p className="text-[11px] text-slate-400">Máy chủ đám mây tự động nạp tệp về kho của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Đường dẫn liên kết tải về (HTTP, HTTPS, FTP hoặc Magnet Link)
            </label>
            <textarea
              rows={3}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link tải tại đây... Ví dụ: https://... hoặc magnet:?xt=urn:btih:..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#06a7ff] focus:ring-2 focus:ring-[#06a7ff]/20 outline-none font-mono resize-none"
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Liên kết mẫu trải nghiệm:</div>
            <div className="space-y-1">
              {sampleLinks.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUrl(sample.url)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#06a7ff] text-xs transition flex items-center justify-between"
                >
                  <span className="truncate">{sample.label}</span>
                  <span className="text-[10px] text-slate-400 ml-2">Dán</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Đặc quyền cụm máy chủ ZhangZhu CDN</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">
                Nếu tệp đã tồn tại trên bộ nhớ đệm đám mây, quá trình nạp tệp sẽ diễn ra gần như ngay tức thì (Instant Hash Match).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={!url.trim() || isAnalyzing || downloadSuccess}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã nạp tệp ngoại tuyến thành công!</span>
              </>
            ) : isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Đang phân tích hash và kết nối mạng P2P...</span>
              </>
            ) : (
              <>
                <CloudDownload className="w-4 h-4" />
                <span>Bắt đầu tải về đám mây</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  Archive,
  Crown,
  Copy,
  Check,
} from 'lucide-react';
import { DriveItem } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';
import { FileTypeIcon } from './Icons.tsx';

interface FilePreviewModalProps {
  item: DriveItem | null;
  onClose: () => void;
  onDownload: (item: DriveItem) => void;
  onShare: (item: DriveItem) => void;
  onOpenVipModal: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  onClose,
  onDownload,
  onShare,
  onOpenVipModal,
}) => {
  if (!item) return null;

  // Image controls
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Video controls
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');
  const [quality, setQuality] = useState('1080P');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyContent = () => {
    if (item.content) {
      navigator.clipboard.writeText(item.content);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-700/60">
        {/* Modal Top Bar */}
        <div className="h-14 px-5 bg-slate-800/90 border-b border-slate-700/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileTypeIcon
              extension={item.extension}
              isFolder={item.isFolder}
              category={item.category}
              className="w-7 h-7"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate text-slate-100">{item.name}</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {formatBytes(item.size)} · Cập nhật: {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded-lg transition"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </button>
            <button
              onClick={() => onDownload(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06a7ff] hover:bg-[#0092e0] text-xs font-semibold rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải xuống</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition ml-2"
              aria-label="Đóng xem trước"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content by Type */}
        <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-black/40">
          {/* VIDEO PLAYER */}
          {item.category === 'video' && (
            <div className="w-full h-full flex flex-col justify-between relative bg-black">
              <div className="flex-1 flex items-center justify-center p-4">
                {item.url ? (
                  <video
                    src={item.url}
                    controls
                    preload="metadata"
                    className="max-h-full max-w-full rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-400">
                    <p className="text-sm font-medium">Chưa có luồng phát trực tiếp cho video này.</p>
                  </div>
                )}
              </div>

              {/* Baidu-style Video Enhancer Toolbar (Speeds, 4K SVIP unlock) */}
              <div className="h-12 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Tốc độ phát:</span>
                  {['0.75', '1.0', '1.25', '1.5', '2.0', '3.0'].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                        playbackSpeed === spd
                          ? 'bg-[#06a7ff] text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x {spd === '3.0' && '⚡SVIP'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Độ phân giải:</span>
                  {['720P', '1080P', '4K Cực Nét'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        if (q.includes('4K')) {
                          onOpenVipModal();
                        }
                        setQuality(q);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                        quality === q
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'text-slate-300 hover:text-white bg-slate-800'
                      }`}
                    >
                      {q.includes('4K') && <Crown className="w-3 h-3 fill-slate-950" />}
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PICTURE PREVIEW */}
          {item.category === 'picture' && (
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                {item.url || item.thumbnail ? (
                  <img
                    src={item.url || item.thumbnail}
                    alt={item.name}
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease',
                    }}
                    className="max-h-[65vh] max-w-[80vw] object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-400">
                    <FileTypeIcon category="picture" className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Không tìm thấy dữ liệu ảnh gốc.</p>
                  </div>
                )}
              </div>

              {/* Bottom Image Toolbar */}
              <div className="h-12 bg-slate-900/90 border-t border-slate-800 px-6 flex items-center justify-center gap-4 text-slate-300">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-2 hover:bg-slate-800 rounded-lg hover:text-white transition cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-2 hover:bg-slate-800 rounded-lg hover:text-white transition cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-slate-700 mx-2" />
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 hover:bg-slate-800 rounded-lg hover:text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
                  title="Xoay 90 độ"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Xoay</span>
                </button>
              </div>
            </div>
          )}

          {/* AUDIO PREVIEW */}
          {item.category === 'audio' && (
            <div className="p-10 flex flex-col items-center justify-center max-w-lg w-full text-center">
              <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 p-1 shadow-2xl mb-6 relative group">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="Album Cover"
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <FileTypeIcon category="audio" className="w-16 h-16" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
              <p className="text-xs text-rose-400 font-mono mb-6">
                Định dạng Lossless HD · Thời lượng: {item.duration || '03:45'}
              </p>

              {/* Native HTML5 Audio element */}
              {item.url ? (
                <audio
                  src={item.url}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl"
                />
              ) : (
                <p className="text-xs text-slate-400">Không có luồng âm thanh phát trực tiếp.</p>
              )}
            </div>
          )}

          {/* DOCUMENT PREVIEW */}
          {item.category === 'document' && (
            <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Trình xem tài liệu đám mây ZhangZhu
                  </span>
                  {item.content && (
                    <button
                      onClick={handleCopyContent}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép văn bản</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {item.extension === 'pdf' && item.url ? (
                  <iframe
                    src={item.url}
                    className="w-full h-[60vh] rounded-xl border border-slate-800 bg-slate-800"
                    title={item.name}
                  />
                ) : (
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {item.content || `Nội dung tài liệu "${item.name}" đã được lưu trữ an toàn trên ZhangZhu Drive.`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ARCHIVE (.ZIP / .RAR) VIEWER */}
          {item.category === 'archive' && (
            <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Archive className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Nội dung tệp nén trực tuyến</h3>
                      <p className="text-[11px] text-slate-400">Xem trực tiếp trên đám mây không cần giải nén về máy</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-bold text-amber-900 bg-amber-400 rounded">
                    ⚡ SVIP Online Unzip
                  </span>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {(item.archiveEntries || [
                    { name: 'setup.exe', size: 45000000, isFolder: false },
                    { name: 'docs/huong_dan.txt', size: 12000, isFolder: false },
                    { name: 'assets/resources.pak', size: 120000000, isFolder: false },
                  ]).map((entry, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between hover:bg-slate-800/50 px-2 rounded transition">
                      <span className="font-mono text-slate-300 truncate">{entry.name}</span>
                      <span className="font-mono text-slate-500 shrink-0 ml-4">
                        {formatBytes(entry.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTHER / DEFAULT */}
          {item.category === 'other' && !item.isFolder && (
            <div className="text-center p-8">
              <FileTypeIcon extension={item.extension} className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
              <p className="text-xs text-slate-400 mb-6">
                Định dạng tệp này có thể tải xuống và mở bằng ứng dụng tương thích trên thiết bị của bạn.
              </p>
              <button
                onClick={() => onDownload(item)}
                className="px-6 py-2.5 bg-[#06a7ff] hover:bg-[#0092e0] text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Tải về máy tính</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

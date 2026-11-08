import React, { useState } from 'react';
import { Share2, Copy, Check, Trash2, ExternalLink, Calendar, KeyRound } from 'lucide-react';
import { SharedLink } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';
import { FileTypeIcon } from './Icons.tsx';

interface SharesViewProps {
  shares: SharedLink[];
  onCancelShare: (id: string) => void;
}

export const SharesView: React.FC<SharesViewProps> = ({ shares, onCancelShare }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (share: SharedLink) => {
    const text = share.extractCode
      ? `Liên kết: https://zhangzhu.drive/s/${share.code} Mật mã trích xuất: ${share.extractCode}`
      : `Liên kết: https://zhangzhu.drive/s/${share.code}`;
    navigator.clipboard.writeText(text);
    setCopiedId(share.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (shares.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center select-none">
        <div className="w-20 h-20 mb-4 rounded-3xl bg-blue-50 flex items-center justify-center text-[#06a7ff]">
          <Share2 className="w-10 h-10 stroke-1" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">Chưa có liên kết chia sẻ nào</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Chọn bất kỳ tệp hoặc thư mục nào trong ZhangZhu Drive rồi bấm nút "Chia sẻ" để tạo liên kết
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 select-none bg-white">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800">Chia sẻ của tôi (我的分享)</h2>
            <p className="text-xs text-slate-400">Danh sách các tệp bạn đã tạo mã chia sẻ ra bên ngoài</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Tổng cộng: {shares.length} liên kết</span>
        </div>

        <div className="space-y-3">
          {shares.map((share) => (
            <div
              key={share.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 transition bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#06a7ff] flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {share.itemsSummary[0]?.name || 'Tệp chia sẻ'}
                    </span>
                    {share.itemsSummary.length > 1 && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                        +{share.itemsSummary.length - 1} mục
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 font-mono">
                    <span className="text-[#06a7ff]">https://zhangzhu.drive/s/{share.code}</span>
                    {share.extractCode && (
                      <span className="font-bold text-amber-700 bg-amber-100 px-1 rounded">
                        Mã: {share.extractCode}
                      </span>
                    )}
                    <span>Hạn: {share.expiryLabel}</span>
                    <span>Lượt xem: {share.viewCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleCopy(share)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  {copiedId === share.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chép link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onCancelShare(share.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Hủy liên kết chia sẻ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

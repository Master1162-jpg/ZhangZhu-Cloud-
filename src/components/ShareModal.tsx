import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
  Link,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';
import { DriveItem, SharedLink } from '../types/drive.ts';
import { generateExtractionCode, generateShareCode } from '../utils/fileUtils.ts';

interface ShareModalProps {
  items: DriveItem[];
  onClose: () => void;
  onCreateShare: (newShare: SharedLink) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  items,
  onClose,
  onCreateShare,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const [expiryDays, setExpiryDays] = useState<'1' | '7' | '30' | 'permanent'>('permanent');
  const [needPassword, setNeedPassword] = useState(true);
  const [customPassword, setCustomPassword] = useState(() => generateExtractionCode());
  const [createdShare, setCreatedShare] = useState<SharedLink | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateShare = () => {
    const code = generateShareCode();
    const extractCode = needPassword ? customPassword.trim().slice(0, 4) || '8888' : '';

    let expiresAt: string | null = null;
    let expiryLabel = 'Vĩnh viễn';

    if (expiryDays !== 'permanent') {
      const days = parseInt(expiryDays, 10);
      const d = new Date();
      d.setDate(d.getDate() + days);
      expiresAt = d.toISOString();
      expiryLabel = `${days} ngày`;
    }

    const newShare: SharedLink = {
      id: `share-${Date.now()}`,
      code,
      extractCode,
      itemIds: items.map((it) => it.id),
      itemsSummary: items.map((it) => ({
        name: it.name,
        size: it.size,
        isFolder: it.isFolder,
        category: it.category,
      })),
      createdAt: new Date().toISOString(),
      expiresAt,
      expiryLabel,
      downloadCount: 0,
      viewCount: 0,
    };

    setCreatedShare(newShare);
    onCreateShare(newShare);
  };

  const getFullShareText = () => {
    if (!createdShare) return '';
    const shareUrl = `https://zhangzhu.drive/s/${createdShare.code}`;
    if (createdShare.extractCode) {
      return `Liên kết: ${shareUrl} Mật mã trích xuất: ${createdShare.extractCode}\nSao chép đoạn này mở ứng dụng hoặc trình duyệt ZhangZhu Drive để lấy tệp`;
    }
    return `Liên kết chia sẻ ZhangZhu Drive: ${shareUrl}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="h-14 px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#06a7ff] flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Chia sẻ tệp tin</h3>
              <p className="text-[11px] text-slate-400">
                {items.length === 1 ? items[0].name : `Đã chọn ${items.length} tệp/thư mục`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!createdShare ? (
            <div className="space-y-5">
              {/* Expiry Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Thời hạn hiệu lực</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1', label: '1 ngày' },
                    { id: '7', label: '7 ngày' },
                    { id: '30', label: '30 ngày' },
                    { id: 'permanent', label: 'Vĩnh viễn' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setExpiryDays(opt.id as any)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                        expiryDays === opt.id
                          ? 'bg-blue-50 border-[#06a7ff] text-[#06a7ff]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Protection (Baidu style extraction code) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mật mã trích xuất (提取码)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needPassword}
                      onChange={(e) => setNeedPassword(e.target.checked)}
                      className="rounded text-[#06a7ff] focus:ring-[#06a7ff]"
                    />
                    <span>Yêu cầu mật mã</span>
                  </label>
                </div>

                {needPassword && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value.toLowerCase())}
                      placeholder="e.g. 8888"
                      className="w-28 h-9 text-center font-mono text-sm uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:border-[#06a7ff] focus:ring-2 focus:ring-[#06a7ff]/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomPassword(generateExtractionCode())}
                      className="text-xs text-[#06a7ff] hover:underline"
                    >
                      Đổi mã ngẫu nhiên
                    </button>
                    <span className="text-[11px] text-slate-400 ml-auto">4 ký tự chữ hoặc số</span>
                  </div>
                )}
              </div>

              {/* Create Share Button */}
              <button
                type="button"
                onClick={handleCreateShare}
                className="w-full py-2.5 bg-[#06a7ff] hover:bg-[#0092e0] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo liên kết chia sẻ</span>
              </button>
            </div>
          ) : (
            // Created State: Link & Extraction Code Display
            <div className="space-y-4">
              {/* Tab Switcher: Link vs QR */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('link')}
                  className={`flex-1 py-2 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'link'
                      ? 'border-[#06a7ff] text-[#06a7ff]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Liên kết & Mật mã</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-2 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'qr'
                      ? 'border-[#06a7ff] text-[#06a7ff]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Mã QR di động</span>
                </button>
              </div>

              {activeTab === 'link' ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Đường dẫn chia sẻ:</div>
                    <div className="font-mono text-xs text-slate-800 font-semibold select-all break-all">
                      https://zhangzhu.drive/s/{createdShare.code}
                    </div>
                  </div>

                  {createdShare.extractCode && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500">Mật mã trích xuất (提取码):</div>
                        <div className="font-mono text-base font-black text-[#06a7ff] tracking-widest">
                          {createdShare.extractCode}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Hiệu lực: {createdShare.expiryLabel}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã sao chép liên kết & mật mã!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao chép liên kết và mã trích xuất</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-40 h-40 mx-auto bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://zhangzhu.drive/s/${createdShare.code}`}
                      alt="Share QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Người nhận có thể dùng ứng dụng ZhangZhu hoặc Zalo/WeChat quét mã để nhận tệp
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

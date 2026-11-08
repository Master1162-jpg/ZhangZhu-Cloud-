import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  FolderInput,
  CheckCircle2,
  AlertCircle,
  FileBox,
  KeyRound,
} from 'lucide-react';
import { SharedLink, DriveItem } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';
import { FileTypeIcon } from './Icons.tsx';

interface ExtractLinkModalProps {
  sharedLinks: SharedLink[];
  allItems: DriveItem[];
  onClose: () => void;
  onSaveToDrive: (items: DriveItem[]) => void;
}

export const ExtractLinkModal: React.FC<ExtractLinkModalProps> = ({
  sharedLinks,
  allItems,
  onClose,
  onSaveToDrive,
}) => {
  const [inputUrl, setInputUrl] = useState('https://zhangzhu.drive/s/8zk19pba');
  const [extractCode, setExtractCode] = useState('8888');
  const [foundShare, setFoundShare] = useState<SharedLink | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleVerify = () => {
    setErrorMsg('');
    setSavedSuccess(false);

    // Extract code from URL e.g. /s/8zk19pba
    let token = '';
    const match = inputUrl.match(/\/s\/([a-zA-Z0-9]+)/);
    if (match) {
      token = match[1];
    } else {
      token = inputUrl.trim();
    }

    const share = sharedLinks.find((s) => s.code.toLowerCase() === token.toLowerCase());
    if (!share) {
      setErrorMsg('Không tìm thấy liên kết chia sẻ hoặc liên kết đã hết hạn.');
      return;
    }

    if (share.extractCode && share.extractCode.toLowerCase() !== extractCode.trim().toLowerCase()) {
      setErrorMsg('Mật mã trích xuất (提取码) không chính xác, vui lòng thử lại.');
      return;
    }

    setFoundShare(share);
  };

  const handleSave = () => {
    if (!foundShare) return;
    const targetItems = allItems.filter((it) => foundShare.itemIds.includes(it.id));
    onSaveToDrive(targetItems);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        <div className="h-14 px-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#06a7ff] flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Trích xuất liên kết chia sẻ</h3>
              <p className="text-[11px] text-slate-400">Nhập liên kết và mật mã để lưu tệp vào ZhangZhu Drive</p>
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
              Đường dẫn liên kết ZhangZhu Drive
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://zhangzhu.drive/s/..."
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#06a7ff] focus:ring-2 focus:ring-[#06a7ff]/20 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật mã trích xuất (提取码)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  maxLength={4}
                  value={extractCode}
                  onChange={(e) => setExtractCode(e.target.value)}
                  placeholder="Nhập 4 ký tự mã trích xuất (ví dụ: 8888)"
                  className="w-full h-10 pl-9 pr-3 text-xs font-mono tracking-widest uppercase bg-slate-50 border border-slate-200 rounded-xl focus:border-[#06a7ff] focus:ring-2 focus:ring-[#06a7ff]/20 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleVerify}
                className="px-4 h-10 bg-[#06a7ff] hover:bg-[#0092e0] text-white font-bold text-xs rounded-xl transition"
              >
                Trích xuất
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {foundShare && (
            <div className="mt-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Tệp tin tìm thấy:</span>
                <span className="text-[11px] text-slate-400">Hiệu lực: {foundShare.expiryLabel}</span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {foundShare.itemsSummary.map((sum, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileTypeIcon isFolder={sum.isFolder} category={sum.category} className="w-6 h-6" />
                      <span className="text-xs font-medium text-slate-800 truncate">{sum.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                      {formatBytes(sum.size)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={savedSuccess}
                className="w-full py-2.5 bg-[#06a7ff] hover:bg-[#0092e0] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:bg-emerald-600"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã lưu thành công vào ZhangZhu Drive!</span>
                  </>
                ) : (
                  <>
                    <FolderInput className="w-4 h-4" />
                    <span>Lưu vào ZhangZhu Drive của tôi</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

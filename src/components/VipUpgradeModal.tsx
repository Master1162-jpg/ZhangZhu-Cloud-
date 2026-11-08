import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  Zap,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onActivateSvip: () => void;
}

export const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  isOpen,
  onClose,
  isVip,
  onActivateSvip,
}) => {
  if (!isOpen) return null;

  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year' | 'forever'>('year');
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  const handleUpgrade = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
    setActivatedSuccess(true);
    onActivateSvip();
    setTimeout(() => {
      setActivatedSuccess(false);
      onClose();
    }, 2000);
  };

  const perks = [
    { title: 'Dung lượng đám mây', free: '2 TB', vip: '5 TB', svip: '10 TB Độc Quyền' },
    { title: 'Tốc độ tải xuống', free: '100 KB/s', vip: '10 MB/s', svip: 'Cực Hạn 50-100 MB/s ⚡' },
    { title: 'Xem trước video', free: '720P', vip: '1080P FHD', svip: '4K Siêu Nét HDR' },
    { title: 'Tải lên tệp đơn', free: '4 GB', vip: '10 GB', svip: '20 GB Siêu Lớn' },
    { title: 'Giải nén online', free: 'Không hỗ trợ', vip: '2 GB', svip: '20 GB Trực Tiếp' },
    { title: 'Két sắt bảo mật', free: '5 tệp', vip: '100 tệp', svip: 'Không Giới Hạn' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="p-6 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md">
              <Crown className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">ZhangZhu SVIP Siêu Cấp</h2>
                <span className="px-2 py-0.5 text-[10px] font-black bg-slate-950 text-amber-300 rounded-full">
                  SVIP 8
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                Mở khóa giới hạn băng thông · Nâng cấp 10.000 GB lưu trữ đám mây
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-900 hover:bg-black/10 rounded-xl transition cursor-pointer"
            aria-label="Đóng bảng SVIP"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Đặc quyền</th>
                  <th className="py-2.5 px-3">Tài khoản Thường</th>
                  <th className="py-2.5 px-3">ZhangZhu VIP</th>
                  <th className="py-2.5 px-3 text-amber-400 font-bold bg-amber-500/10 rounded-t-lg">
                    SVIP Siêu Cấp 👑
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {perks.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium text-slate-300">{p.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.free}</td>
                    <td className="py-2.5 px-3 text-slate-300">{p.vip}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300 bg-amber-500/10">
                      {p.svip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'month', label: 'Gói 1 Tháng', price: '69.000 đ', tag: 'Dùng thử' },
              { id: 'year', label: 'Gói 1 Năm', price: '499.000 đ', tag: 'Phổ biến nhất (Tiết kiệm 45%)' },
              { id: 'forever', label: 'Gói Trọn Đời', price: '1.290.000 đ', tag: 'Độc quyền VIP' },
            ].map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-amber-400 bg-amber-500/15 text-white ring-2 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] text-amber-400 font-semibold mb-1">{plan.tag}</div>
                <div className="text-xs font-bold">{plan.label}</div>
                <div className="text-base font-black text-amber-400 mt-1">{plan.price}</div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUpgrade}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
          >
            {activatedSuccess ? (
              <>
                <Check className="w-5 h-5 text-slate-950" />
                <span>ĐÃ KÍCH HOẠT THÀNH CÔNG DUNG LƯỢNG 10 TB!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>KÍCH HOẠT / GIA HẠN ĐẶC QUYỀN SVIP NGAY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

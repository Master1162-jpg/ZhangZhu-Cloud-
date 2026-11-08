import React, { useState } from 'react';
import {
  X,
  ArrowDownToLine,
  ArrowUpToLine,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  Zap,
  Crown,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { TransferTask } from '../types/drive.ts';
import { formatBytes } from '../utils/fileUtils.ts';

interface TransferCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TransferTask[];
  onTogglePause: (id: string) => void;
  onClearCompleted: () => void;
  isVipSpeedBoosted: boolean;
  onToggleVipSpeed: () => void;
  onOpenVipModal: () => void;
}

export const TransferCenterDrawer: React.FC<TransferCenterDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  onTogglePause,
  onClearCompleted,
  isVipSpeedBoosted,
  onToggleVipSpeed,
  onOpenVipModal,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'download' | 'upload' | 'completed'>('download');

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'completed') return t.status === 'completed';
    if (activeTab === 'download') return t.type === 'download' || t.type === 'offline';
    return t.type === 'upload';
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Top Header */}
        <div className="h-14 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#06a7ff] flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Danh Sách Truyền Tải (传输)</h3>
              <p className="text-[11px] text-slate-400">Quản lý các tác vụ tải lên & tải xuống</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SVIP Extreme Speed Banner (Iconic Baidu Netdisk experience!) */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shrink-0 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 fill-slate-950" />
              <div>
                <div className="flex items-center gap-1.5 font-black text-xs tracking-tight">
                  <span>ZHANGZHU SVIP CỰC HẠN TĂNG TỐC</span>
                  <span className="px-1 py-0.2 bg-slate-950 text-amber-300 rounded text-[9px] font-mono">
                    50 MB/s
                  </span>
                </div>
                <p className="text-[10px] text-slate-900 font-medium">
                  {isVipSpeedBoosted
                    ? 'Đang kích hoạt đường truyền cao tốc quang học CDN'
                    : 'Tài khoản thường bị giới hạn băng thông ~120 KB/s'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleVipSpeed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                isVipSpeedBoosted
                  ? 'bg-slate-950 text-amber-300 hover:bg-slate-900'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isVipSpeedBoosted ? 'Đang Tăng Tốc ⚡' : 'Kích Hoạt Tăng Tốc'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 shrink-0">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-[#06a7ff] text-[#06a7ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Đang tải xuống</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#06a7ff] text-[#06a7ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowUpToLine className="w-3.5 h-3.5" />
            <span>Đang tải lên</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'border-[#06a7ff] text-[#06a7ff]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành</span>
          </button>

          {activeTab === 'completed' && filteredTasks.length > 0 && (
            <button
              onClick={onClearCompleted}
              className="ml-auto text-xs text-rose-500 hover:text-rose-700 font-medium py-3"
            >
              Dọn dẹp
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Gauge className="w-10 h-10 mx-auto mb-2 stroke-1 opacity-50" />
              <p className="text-xs">Không có tác vụ truyền tải nào ở mục này</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[280px]" title={task.name}>
                    {task.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {task.status === 'running' && (
                      <button
                        onClick={() => onTogglePause(task.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/50"
                        title="Tạm dừng"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {task.status === 'paused' && (
                      <button
                        onClick={() => onTogglePause(task.id)}
                        className="p-1 text-[#06a7ff] hover:text-blue-700 rounded hover:bg-blue-50"
                        title="Tiếp tục"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      task.status === 'completed'
                        ? 'bg-emerald-500'
                        : task.status === 'paused'
                        ? 'bg-amber-400'
                        : isVipSpeedBoosted
                        ? 'bg-gradient-to-r from-amber-500 to-[#06a7ff]'
                        : 'bg-[#06a7ff]'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>
                    {formatBytes((task.size * task.progress) / 100)} / {formatBytes(task.size)} ({Math.round(task.progress)}%)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    {task.status === 'completed' ? (
                      <span className="text-emerald-600 font-sans flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Hoàn thành
                      </span>
                    ) : task.status === 'paused' ? (
                      <span className="text-amber-600 font-sans">Tạm dừng</span>
                    ) : (
                      <span className={isVipSpeedBoosted ? 'text-amber-600' : 'text-blue-600'}>
                        {isVipSpeedBoosted ? '⚡ ' : ''}{task.speed}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { Breadcrumb } from './components/Breadcrumb.tsx';
import { FileList } from './components/FileList.tsx';
import { FilePreviewModal } from './components/FilePreviewModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ExtractLinkModal } from './components/ExtractLinkModal.tsx';
import { OfflineDownloadModal } from './components/OfflineDownloadModal.tsx';
import { SafeBoxView } from './components/SafeBoxView.tsx';
import { TransferCenterDrawer } from './components/TransferCenterDrawer.tsx';
import { VipUpgradeModal } from './components/VipUpgradeModal.tsx';
import { NewFolderModal } from './components/NewFolderModal.tsx';
import { RenameModal } from './components/RenameModal.tsx';
import { MoveModal } from './components/MoveModal.tsx';
import { SharesView } from './components/SharesView.tsx';

import {
  DriveItem,
  DriveUser,
  SharedLink,
  TransferTask,
  FileCategory,
  ViewMode,
  SortField,
  SortOrder,
} from './types/drive.ts';
import {
  INITIAL_USER,
  INITIAL_ITEMS,
  INITIAL_SHARED_LINKS,
} from './data/seedData.ts';
import {
  sortItems,
  searchAndFilterItems,
  buildBreadcrumbPath,
  calculateTotalBytes,
  getFileCategory,
  getFileExtension,
} from './utils/fileUtils.ts';
import { UploadCloud } from 'lucide-react';

export default function App() {
  // Main Data States
  const [items, setItems] = useState<DriveItem[]>(INITIAL_ITEMS);
  const [user, setUser] = useState<DriveUser>(INITIAL_USER);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>(INITIAL_SHARED_LINKS);
  const [transferTasks, setTransferTasks] = useState<TransferTask[]>([
    {
      id: 'task-demo-1',
      name: 'Phim_Chieu_Rap_4K_HDR_Ultra.mkv',
      size: 1024 * 1024 * 1024 * 3.2,
      progress: 68,
      speed: '48.5 MB/s',
      type: 'download',
      status: 'running',
      isVipSpeed: true,
    },
    {
      id: 'task-demo-2',
      name: 'Backup_Du_Lieu_ZhangZhu_2026.tar.gz',
      size: 1024 * 1024 * 512,
      progress: 100,
      speed: '0 KB/s',
      type: 'upload',
      status: 'completed',
    },
  ]);

  // Navigation & View States
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<(string | null)[]>([]);
  const [currentCategory, setCurrentCategory] = useState<FileCategory>('all');
  const [activeView, setActiveView] = useState<'drive' | 'offline' | 'safebox' | 'shares' | 'trash'>('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals & Panels
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);
  const [shareModalItems, setShareModalItems] = useState<DriveItem[] | null>(null);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isSafeBoxUnlocked, setIsSafeBoxUnlocked] = useState(false);
  const [isTransferCenterOpen, setIsTransferCenterOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [renameTargetItem, setRenameTargetItem] = useState<DriveItem | null>(null);
  const [moveTargetItems, setMoveTargetItems] = useState<DriveItem[] | null>(null);
  const [moveMode, setMoveMode] = useState<'move' | 'copy'>('move');
  const [isVipSpeedBoosted, setIsVipSpeedBoosted] = useState(true);

  // Drag and Drop overlay state
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Hidden File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Dynamic transfer task progress ticker (only when running tasks exist)
  useEffect(() => {
    const hasRunningTasks = transferTasks.some((t) => t.status === 'running');
    if (!hasRunningTasks) return;

    const interval = setInterval(() => {
      setTransferTasks((prev) => {
        let changed = false;
        const updated = prev.map((t) => {
          if (t.status !== 'running') return t;
          changed = true;
          const increment = isVipSpeedBoosted ? 5 : 1;
          const nextProgress = Math.min(100, t.progress + increment);
          const currentSpeed = isVipSpeedBoosted ? '48.5 MB/s' : '110 KB/s';

          return {
            ...t,
            progress: nextProgress,
            speed: nextProgress >= 100 ? '0 KB/s' : currentSpeed,
            status: (nextProgress >= 100 ? 'completed' : 'running') as 'completed' | 'running',
          };
        });
        return changed ? updated : prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isVipSpeedBoosted, transferTasks]);

  // Compute Item Counts for Sidebar
  const itemCounts = useMemo(() => {
    const nonTrash = items.filter((it) => !it.inTrash && !it.isSafeBox);
    return {
      all: nonTrash.length,
      picture: nonTrash.filter((it) => it.category === 'picture').length,
      document: nonTrash.filter((it) => it.category === 'document').length,
      video: nonTrash.filter((it) => it.category === 'video').length,
      audio: nonTrash.filter((it) => it.category === 'audio').length,
      archive: nonTrash.filter((it) => it.category === 'archive').length,
      other: nonTrash.filter((it) => it.category === 'other' && !it.isFolder).length,
      trash: items.filter((it) => it.inTrash).length,
      safebox: items.filter((it) => it.isSafeBox).length,
      shares: sharedLinks.length,
    };
  }, [items, sharedLinks]);

  // Filtered & Sorted Items
  const displayedItems = useMemo(() => {
    let viewScope: 'currentFolder' | 'allFiles' | 'trash' | 'safeBox' = 'currentFolder';
    if (activeView === 'trash') viewScope = 'trash';
    else if (activeView === 'safebox') viewScope = 'safeBox';
    else if (currentCategory !== 'all') viewScope = 'allFiles';

    const filtered = searchAndFilterItems(
      items,
      searchQuery,
      activeView === 'drive' ? currentCategory : 'all',
      currentFolderId,
      viewScope
    );

    return sortItems(filtered, sortField, sortOrder);
  }, [items, searchQuery, currentCategory, currentFolderId, activeView, sortField, sortOrder]);

  // Breadcrumbs
  const breadcrumbPath = useMemo(() => {
    if (activeView === 'trash') return [{ id: null, name: 'Thùng rác' }];
    if (activeView === 'safebox') return [{ id: null, name: 'Không gian an toàn' }];
    if (activeView === 'shares') return [{ id: null, name: 'Chia sẻ của tôi' }];
    if (currentCategory !== 'all') {
      const labels: Record<string, string> = {
        picture: 'Hình ảnh',
        document: 'Tài liệu',
        video: 'Video',
        audio: 'Âm nhạc',
        archive: 'Tệp nén',
        other: 'Khác',
      };
      return [{ id: null, name: labels[currentCategory] || 'Tập tin' }];
    }
    return buildBreadcrumbPath(currentFolderId, items);
  }, [activeView, currentCategory, currentFolderId, items]);

  // Navigation handlers
  const handleNavigateFolder = (folderId: string | null) => {
    setFolderHistory((prev) => [...prev, currentFolderId]);
    setCurrentFolderId(folderId);
    setSelectedIds(new Set());
  };

  const handleGoBack = () => {
    if (folderHistory.length > 0) {
      const prev = folderHistory[folderHistory.length - 1];
      setFolderHistory((h) => h.slice(0, -1));
      setCurrentFolderId(prev);
      setSelectedIds(new Set());
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Đã làm mới danh sách tệp');
    }, 600);
  };

  // Selection handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(displayedItems.map((i) => i.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleItemClick = (item: DriveItem) => {
    setSelectedIds(() => {
      const next = new Set<string>();
      next.add(item.id);
      return next;
    });
  };

  const handleItemDoubleClick = (item: DriveItem) => {
    if (item.isFolder) {
      handleNavigateFolder(item.id);
    } else {
      setPreviewItem(item);
    }
  };

  // Actions
  const handleCreateFolder = (name: string) => {
    const newFolder: DriveItem = {
      id: `folder-${Date.now()}`,
      name,
      isFolder: true,
      parentId: currentFolderId,
      size: 0,
      updatedAt: new Date().toISOString(),
      category: 'other',
    };
    setItems((prev) => [newFolder, ...prev]);
    showToast(`Đã tạo thư mục "${name}"`);
  };

  const handleRename = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, name: newName, updatedAt: new Date().toISOString() } : it))
    );
    showToast(`Đã đổi tên thành "${newName}"`);
  };

  const handleDeleteSelected = () => {
    if (activeView === 'trash') {
      // Permanent delete
      setItems((prev) => prev.filter((it) => !selectedIds.has(it.id)));
      showToast('Đã xóa vĩnh viễn các tệp đã chọn');
    } else {
      // Move to trash
      setItems((prev) =>
        prev.map((it) => (selectedIds.has(it.id) ? { ...it, inTrash: true } : it))
      );
      showToast('Đã chuyển các tệp vào Thùng rác');
    }
    setSelectedIds(new Set());
  };

  const handleRestoreSelected = () => {
    setItems((prev) =>
      prev.map((it) => (selectedIds.has(it.id) ? { ...it, inTrash: false } : it))
    );
    setSelectedIds(new Set());
    showToast('Đã khôi phục các tệp đã chọn về vị trí cũ');
  };

  const handleEmptyTrash = () => {
    setItems((prev) => prev.filter((it) => !it.inTrash));
    setSelectedIds(new Set());
    showToast('Đã dọn sạch thùng rác');
  };

  const handleMoveOrCopyConfirm = (targetFolderId: string | null) => {
    if (!moveTargetItems) return;
    const targetIds = new Set(moveTargetItems.map((i) => i.id));

    if (moveMode === 'move') {
      setItems((prev) =>
        prev.map((it) => (targetIds.has(it.id) ? { ...it, parentId: targetFolderId } : it))
      );
      showToast(`Đã di chuyển ${moveTargetItems.length} mục`);
    } else {
      // Copy
      const copies: DriveItem[] = moveTargetItems.map((it) => ({
        ...it,
        id: `copy-${Date.now()}-${Math.random()}`,
        name: `${it.name} (Bản sao)`,
        parentId: targetFolderId,
        updatedAt: new Date().toISOString(),
      }));
      setItems((prev) => [...copies, ...prev]);
      showToast(`Đã sao chép ${moveTargetItems.length} mục`);
    }
    setMoveTargetItems(null);
    setSelectedIds(new Set());
  };

  const handleMoveToSafeBox = (itemsToLock: DriveItem[]) => {
    const ids = new Set(itemsToLock.map((i) => i.id));
    setItems((prev) =>
      prev.map((it) => (ids.has(it.id) ? { ...it, isSafeBox: true } : it))
    );
    setSelectedIds(new Set());
    showToast(`Đã chuyển ${itemsToLock.length} mục vào Két sắt an toàn`);
  };

  const handleRemoveFromSafeBox = (item: DriveItem) => {
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, isSafeBox: false } : it))
    );
    showToast(`Đã đưa "${item.name}" ra khỏi két sắt về thư mục gốc`);
  };

  // Upload simulation and real file selection
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const newDriveItems: DriveItem[] = [];
    const newTasks: TransferTask[] = [];

    for (const file of filesArray) {
      const ext = getFileExtension(file.name);
      const cat = getFileCategory(file.name);
      const blobUrl = URL.createObjectURL(file);

      let textContent: string | undefined = undefined;
      let resolution: string | undefined = undefined;

      // If text/document, read actual contents
      const isTextFile = [
        'txt', 'md', 'json', 'csv', 'js', 'ts', 'jsx', 'tsx',
        'html', 'css', 'xml', 'log', 'yaml', 'yml', 'py', 'java', 'sql', 'sh'
      ].includes(ext);

      if (isTextFile) {
        try {
          textContent = await file.text();
        } catch (e) {
          console.warn('Could not read text content:', e);
        }
      }

      // If image, read actual natural width and height from the uploaded image
      if (cat === 'picture') {
        try {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              if (img.naturalWidth && img.naturalHeight) {
                resolution = `${img.naturalWidth}x${img.naturalHeight}`;
              }
              resolve();
            };
            img.onerror = () => resolve();
            img.src = blobUrl;
          });
        } catch {
          // ignore error
        }
      }

      const newItem: DriveItem = {
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        isFolder: false,
        parentId: currentFolderId,
        size: file.size,
        updatedAt: new Date().toISOString(),
        extension: ext,
        category: cat,
        url: blobUrl, // EXACT original uploaded file
        thumbnail: cat === 'picture' ? blobUrl : undefined, // EXACT uploaded image thumbnail
        content: textContent, // EXACT uploaded text content
        resolution: resolution,
      };

      newDriveItems.push(newItem);

      newTasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        progress: 100, // Instant upload for local user file
        speed: '0 KB/s',
        type: 'upload',
        status: 'completed',
        isVipSpeed: isVipSpeedBoosted,
      });
    }

    setItems((prev) => [...newDriveItems, ...prev]);
    setTransferTasks((prev) => [...newTasks, ...prev]);
    setUser((prev) => ({
      ...prev,
      usedBytes: prev.usedBytes + newDriveItems.reduce((acc, i) => acc + i.size, 0),
    }));

    // Reset file inputs so user can upload the same file again if desired
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';

    showToast(`Đã tải lên thành công ${newDriveItems.length} tệp nguyên bản!`);
  };

  // Offline task start
  const handleStartOfflineTask = (name: string, size: number, category: FileCategory) => {
    const newItem: DriveItem = {
      id: `offline-${Date.now()}`,
      name,
      isFolder: false,
      parentId: currentFolderId,
      size,
      updatedAt: new Date().toISOString(),
      extension: getFileExtension(name),
      category,
    };

    setItems((prev) => [newItem, ...prev]);

    setTransferTasks((prev) => [
      {
        id: `offline-task-${Date.now()}`,
        name,
        size,
        progress: 100,
        speed: '0 KB/s',
        type: 'offline',
        status: 'completed',
        isVipSpeed: true,
      },
      ...prev,
    ]);

    setUser((prev) => ({ ...prev, usedBytes: prev.usedBytes + size }));
    showToast(`Tải ngoại tuyến "${name}" hoàn tất!`);
  };

  // Download real file
  const handleDownloadSelected = (targetItems?: DriveItem[]) => {
    const toDownload = targetItems || items.filter((i) => selectedIds.has(i.id));
    if (toDownload.length === 0) return;

    // Trigger authentic browser file download for each item
    toDownload.forEach((it) => {
      if (it.isFolder) return;
      try {
        let downloadUrl = it.url;
        let shouldRevoke = false;

        if (!downloadUrl && it.content) {
          const blob = new Blob([it.content], { type: 'text/plain;charset=utf-8' });
          downloadUrl = URL.createObjectURL(blob);
          shouldRevoke = true;
        }

        if (downloadUrl) {
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = it.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          if (shouldRevoke) {
            setTimeout(() => URL.revokeObjectURL(downloadUrl!), 2000);
          }
        }
      } catch (err) {
        console.error('Download error:', err);
      }
    });

    const newTasks: TransferTask[] = toDownload.map((it) => ({
      id: `dl-${Date.now()}-${Math.random()}`,
      name: it.name,
      size: it.size,
      progress: 5,
      speed: isVipSpeedBoosted ? '48.9 MB/s (SVIP 极速)' : '115 KB/s',
      type: 'download',
      status: 'running',
      isVipSpeed: isVipSpeedBoosted,
    }));

    setTransferTasks((prev) => [...newTasks, ...prev]);
    setIsTransferCenterOpen(true);
    showToast(`Bắt đầu tải xuống ${toDownload.length} mục`);
  };

  // Drag and drop handlers on document
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const folderItems = useMemo(() => items.filter((it) => it.isFolder && !it.inTrash), [items]);

  return (
    <div
      className="h-screen w-screen flex flex-col bg-[#f0f2f5] overflow-hidden font-sans text-slate-800"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        type="file"
        ref={folderInputRef}
        {...({ webkitdirectory: '' } as any)}
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        transferTasks={transferTasks}
        onOpenTransferCenter={() => setIsTransferCenterOpen(true)}
        onOpenOfflineDownload={() => setIsOfflineModalOpen(true)}
        onOpenExtractLink={() => setIsExtractModalOpen(true)}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />

      {/* App Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setCurrentFolderId(null);
            setSelectedIds(new Set());
          }}
          activeView={activeView}
          onSelectView={(v) => {
            setActiveView(v);
            setSelectedIds(new Set());
            if (v === 'offline') setIsOfflineModalOpen(true);
          }}
          user={user}
          onOpenVipModal={() => setIsVipModalOpen(true)}
          itemCounts={itemCounts}
        />

        {/* Main Content Surface */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Drag Overlay */}
          {isDraggingOver && (
            <div className="absolute inset-0 bg-[#06a7ff]/10 backdrop-blur-xs border-4 border-dashed border-[#06a7ff] z-40 flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
              <UploadCloud className="w-16 h-16 text-[#06a7ff] animate-bounce" />
              <p className="text-base font-bold text-slate-800 mt-2">
                Thả tệp vào đây để tải lên ZhangZhu Drive
              </p>
              <p className="text-xs text-slate-500 mt-1">Hỗ trợ tải lên đa tệp và thư mục tốc độ cao</p>
            </div>
          )}

          {/* VIEW SWITCHER */}
          {activeView === 'safebox' ? (
            <SafeBoxView
              safeItems={items.filter((it) => it.isSafeBox)}
              isUnlocked={isSafeBoxUnlocked}
              onUnlock={() => setIsSafeBoxUnlocked(true)}
              onLock={() => setIsSafeBoxUnlocked(false)}
              onRemoveFromSafeBox={handleRemoveFromSafeBox}
              onPreviewItem={(it) => setPreviewItem(it)}
              onShareItem={(it) => setShareModalItems([it])}
              onDownloadItem={(it) => handleDownloadSelected([it])}
              onDeleteItem={(it) => {
                setItems((prev) => prev.filter((i) => i.id !== it.id));
                showToast(`Đã xóa "${it.name}"`);
              }}
            />
          ) : activeView === 'shares' ? (
            <SharesView
              shares={sharedLinks}
              onCancelShare={(id) => {
                setSharedLinks((prev) => prev.filter((s) => s.id !== id));
                showToast('Đã hủy liên kết chia sẻ');
              }}
            />
          ) : (
            <>
              {/* Action Toolbar */}
              <Toolbar
                selectedCount={selectedIds.size}
                onClearSelection={handleClearSelection}
                onOpenUpload={(type) => {
                  if (type === 'file') fileInputRef.current?.click();
                  else folderInputRef.current?.click();
                }}
                onOpenNewFolder={() => setIsNewFolderModalOpen(true)}
                onOpenOfflineDownload={() => setIsOfflineModalOpen(true)}
                onDownloadSelected={() => handleDownloadSelected()}
                onShareSelected={() => {
                  const sel = items.filter((i) => selectedIds.has(i.id));
                  setShareModalItems(sel);
                }}
                onDeleteSelected={handleDeleteSelected}
                onRenameSelected={() => {
                  const item = items.find((i) => selectedIds.has(i.id));
                  if (item) setRenameTargetItem(item);
                }}
                onMoveSelected={() => {
                  const sel = items.filter((i) => selectedIds.has(i.id));
                  setMoveTargetItems(sel);
                  setMoveMode('move');
                }}
                onCopySelected={() => {
                  const sel = items.filter((i) => selectedIds.has(i.id));
                  setMoveTargetItems(sel);
                  setMoveMode('copy');
                }}
                onSafeBoxSelected={() => {
                  const sel = items.filter((i) => selectedIds.has(i.id));
                  handleMoveToSafeBox(sel);
                }}
                viewMode={viewMode}
                onToggleViewMode={setViewMode}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={(f, o) => {
                  setSortField(f);
                  setSortOrder(o);
                }}
                isTrashView={activeView === 'trash'}
                onEmptyTrash={handleEmptyTrash}
                onRestoreSelected={handleRestoreSelected}
              />

              {/* Breadcrumbs & Status Bar */}
              <Breadcrumb
                path={breadcrumbPath}
                onNavigate={handleNavigateFolder}
                onGoBack={handleGoBack}
                canGoBack={folderHistory.length > 0}
                totalItems={displayedItems.length}
                totalBytes={calculateTotalBytes(displayedItems)}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              {/* File Listing Area */}
              <FileList
                items={displayedItems}
                viewMode={viewMode}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onItemClick={handleItemClick}
                onItemDoubleClick={handleItemDoubleClick}
                onShareItem={(it) => setShareModalItems([it])}
                onDownloadItem={(it) => handleDownloadSelected([it])}
                onDeleteItem={(it) => {
                  if (it.inTrash) {
                    setItems((prev) => prev.filter((i) => i.id !== it.id));
                    showToast(`Đã xóa vĩnh viễn "${it.name}"`);
                  } else {
                    setItems((prev) =>
                      prev.map((i) => (i.id === it.id ? { ...i, inTrash: true } : i))
                    );
                    showToast(`Đã đưa "${it.name}" vào thùng rác`);
                  }
                }}
                onRenameItem={(it) => setRenameTargetItem(it)}
                onSafeBoxItem={(it) => handleMoveToSafeBox([it])}
              />
            </>
          )}
        </main>
      </div>

      {/* MODAL DIALOGS */}
      {/* File Preview Modal */}
      <FilePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDownload={(it) => handleDownloadSelected([it])}
        onShare={(it) => setShareModalItems([it])}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />

      {/* Share Modal */}
      {shareModalItems && (
        <ShareModal
          items={shareModalItems}
          onClose={() => setShareModalItems(null)}
          onCreateShare={(newShare) => {
            setSharedLinks((prev) => [newShare, ...prev]);
            showToast('Đã tạo liên kết chia sẻ!');
          }}
        />
      )}

      {/* Extract Link Modal */}
      {isExtractModalOpen && (
        <ExtractLinkModal
          sharedLinks={sharedLinks}
          allItems={items}
          onClose={() => setIsExtractModalOpen(false)}
          onSaveToDrive={(targetItems) => {
            const copies: DriveItem[] = targetItems.map((it) => ({
              ...it,
              id: `extracted-${Date.now()}-${Math.random()}`,
              name: `${it.name}`,
              parentId: currentFolderId,
              updatedAt: new Date().toISOString(),
            }));
            setItems((prev) => [...copies, ...prev]);
            showToast(`Đã lưu ${targetItems.length} tệp vào ZhangZhu Drive!`);
          }}
        />
      )}

      {/* Offline Download Modal */}
      {isOfflineModalOpen && (
        <OfflineDownloadModal
          currentFolderId={currentFolderId}
          onClose={() => setIsOfflineModalOpen(false)}
          onStartOfflineTask={handleStartOfflineTask}
        />
      )}

      {/* Transfer Center Drawer */}
      <TransferCenterDrawer
        isOpen={isTransferCenterOpen}
        onClose={() => setIsTransferCenterOpen(false)}
        tasks={transferTasks}
        onTogglePause={(id) => {
          setTransferTasks((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t
            )
          );
        }}
        onClearCompleted={() => {
          setTransferTasks((prev) => prev.filter((t) => t.status !== 'completed'));
          showToast('Đã dọn dẹp các tác vụ hoàn thành');
        }}
        isVipSpeedBoosted={isVipSpeedBoosted}
        onToggleVipSpeed={() => {
          setIsVipSpeedBoosted(!isVipSpeedBoosted);
          showToast(
            !isVipSpeedBoosted
              ? '⚡ Đã kích hoạt ZhangZhu SVIP Cực Hạn Tăng Tốc (50 MB/s)!'
              : 'Đã chuyển về tốc độ thường'
          );
        }}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />

      {/* SVIP Upgrade Modal */}
      <VipUpgradeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        isVip={user.isVip}
        onActivateSvip={() => {
          setUser((prev) => ({
            ...prev,
            isVip: true,
            vipTier: 'SVIP',
            totalBytes: 10 * 1024 * 1024 * 1024 * 1024, // 10 TB!
          }));
          setIsVipSpeedBoosted(true);
          showToast('Chúc mừng! Bạn đã nâng cấp thành công dung lượng 10.000 GB SVIP!');
        }}
      />

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      {/* Rename Modal */}
      <RenameModal
        item={renameTargetItem}
        onClose={() => setRenameTargetItem(null)}
        onRename={handleRename}
      />

      {/* Move / Copy Modal */}
      {moveTargetItems && (
        <MoveModal
          selectedItems={moveTargetItems}
          folders={folderItems}
          currentFolderId={currentFolderId}
          mode={moveMode}
          onClose={() => setMoveTargetItems(null)}
          onConfirm={handleMoveOrCopyConfirm}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-xs text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/60 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-[#06a7ff] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

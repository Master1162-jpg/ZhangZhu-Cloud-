export type FileCategory =
  | 'all'
  | 'picture'
  | 'document'
  | 'video'
  | 'audio'
  | 'archive'
  | 'other';

export type ViewMode = 'list' | 'grid';

export type SortField = 'name' | 'size' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface DriveItem {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null; // null means root folder
  size: number; // in bytes
  updatedAt: string; // ISO date string
  extension?: string;
  category: FileCategory;
  mimeType?: string;
  url?: string; // sample preview or data url
  thumbnail?: string;
  inTrash?: boolean;
  isSafeBox?: boolean;
  isStarred?: boolean;
  content?: string; // For text/code/notes preview
  archiveEntries?: { name: string; size: number; isFolder: boolean }[]; // for zip
  duration?: string; // for audio/video (e.g. "04:32")
  resolution?: string; // for video/image (e.g. "3840x2160 (4K)")
}

export interface SharedLink {
  id: string;
  code: string; // 8-char URL key
  extractCode: string; // 4-char extraction code (Baidu style e.g. "8888")
  itemIds: string[];
  itemsSummary: { name: string; size: number; isFolder: boolean; category: FileCategory }[];
  createdAt: string;
  expiresAt: string | null; // null for permanent
  expiryLabel: string;
  downloadCount: number;
  viewCount: number;
}

export interface TransferTask {
  id: string;
  name: string;
  size: number;
  progress: number; // 0 - 100
  speed: string; // e.g. "45.2 MB/s" or "120 KB/s"
  type: 'download' | 'upload' | 'offline';
  status: 'running' | 'paused' | 'completed' | 'error';
  isVipSpeed?: boolean;
}

export interface DriveUser {
  name: string;
  avatar: string;
  isVip: boolean;
  vipTier: 'none' | 'VIP' | 'SVIP';
  vipExpireDate: string;
  usedBytes: number;
  totalBytes: number;
}

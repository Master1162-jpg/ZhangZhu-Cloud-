import { DriveItem, FileCategory, SortField, SortOrder } from '../types/drive.ts';

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function getFileCategory(filename: string, isFolder: boolean = false): FileCategory {
  if (isFolder) return 'other';
  const ext = getFileExtension(filename);

  const pictures = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const documents = ['doc', 'docx', 'pdf', 'txt', 'md', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'json', 'ts', 'js', 'html', 'css'];
  const videos = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v'];
  const audios = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
  const archives = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso'];

  if (pictures.includes(ext)) return 'picture';
  if (documents.includes(ext)) return 'document';
  if (videos.includes(ext)) return 'video';
  if (audios.includes(ext)) return 'audio';
  if (archives.includes(ext)) return 'archive';
  return 'other';
}

export function generateExtractionCode(length: number = 4): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyz'; // avoids easily confused characters 0,1,i,l,o
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateShareCode(length: number = 8): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function sortItems(items: DriveItem[], field: SortField, order: SortOrder): DriveItem[] {
  return [...items].sort((a, b) => {
    // Folders always precede files in Baidu Netdisk style
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;

    let comparison = 0;
    if (field === 'name') {
      comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    } else if (field === 'size') {
      comparison = a.size - b.size;
    } else if (field === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

export function searchAndFilterItems(
  items: DriveItem[],
  query: string,
  category: FileCategory,
  currentFolderId: string | null,
  viewScope: 'currentFolder' | 'allFiles' | 'trash' | 'safeBox'
): DriveItem[] {
  return items.filter((item) => {
    // Trash check
    if (viewScope === 'trash') {
      if (!item.inTrash) return false;
    } else {
      if (item.inTrash) return false;
    }

    // SafeBox check
    if (viewScope === 'safeBox') {
      if (!item.isSafeBox) return false;
    } else if (viewScope !== 'trash') {
      if (item.isSafeBox) return false;
    }

    // Category filter when browsing specific category tabs
    if (category !== 'all') {
      if (item.isFolder) return false; // In category view, show categorized files
      if (item.category !== category) return false;
    } else if (viewScope === 'currentFolder' && !query.trim()) {
      // In normal folder navigation, only show items with parentId == currentFolderId
      if (item.parentId !== currentFolderId) return false;
    }

    // Query filter
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const nameMatch = item.name.toLowerCase().includes(q);
      const extMatch = item.extension?.toLowerCase().includes(q) || false;
      if (!nameMatch && !extMatch) return false;
    }

    return true;
  });
}

export function calculateTotalBytes(items: DriveItem[]): number {
  return items
    .filter((it) => !it.inTrash && !it.isFolder)
    .reduce((acc, it) => acc + it.size, 0);
}

export function buildBreadcrumbPath(
  currentFolderId: string | null,
  allItems: DriveItem[]
): { id: string | null; name: string }[] {
  const path: { id: string | null; name: string }[] = [{ id: null, name: 'Tất cả tệp' }];
  if (!currentFolderId) return path;

  const chain: { id: string; name: string }[] = [];
  let currId: string | null = currentFolderId;

  while (currId) {
    const folder = allItems.find((it) => it.id === currId && it.isFolder);
    if (!folder) break;
    chain.unshift({ id: folder.id, name: folder.name });
    currId = folder.parentId;
  }

  return [...path, ...chain];
}

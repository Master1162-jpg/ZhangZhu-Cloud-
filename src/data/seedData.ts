import { DriveItem, DriveUser, SharedLink } from '../types/drive.ts';

export const INITIAL_USER: DriveUser = {
  name: 'ZhangZhu Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isVip: true,
  vipTier: 'SVIP',
  vipExpireDate: '2028-12-31',
  usedBytes: 462829158400, // ~431 GB
  totalBytes: 2199023255552, // 2 TB (expands to 10 TB when boosted)
};

export const INITIAL_ITEMS: DriveItem[] = [
  // Top-level folders
  {
    id: 'folder-video',
    name: 'Phim Điện Ảnh 4K & Clip',
    isFolder: true,
    parentId: null,
    size: 4831838208, // ~4.5 GB
    updatedAt: '2026-03-24T10:30:00Z',
    category: 'other',
  },
  {
    id: 'folder-docs',
    name: 'Tài Liệu Dự Án & Học Tập',
    isFolder: true,
    parentId: null,
    size: 25482910,
    updatedAt: '2026-03-22T08:15:00Z',
    category: 'other',
  },
  {
    id: 'folder-photos',
    name: 'Album Ảnh Du Lịch 2026',
    isFolder: true,
    parentId: null,
    size: 184589300,
    updatedAt: '2026-03-20T14:40:00Z',
    category: 'other',
  },
  {
    id: 'folder-music',
    name: 'Nhạc Lossless & Lo-Fi Chill',
    isFolder: true,
    parentId: null,
    size: 452938100,
    updatedAt: '2026-03-18T19:00:00Z',
    category: 'other',
  },

  // Inside folder-video
  {
    id: 'file-v1',
    name: 'ZhangZhu_Cinematic_Showcase_4K.mp4',
    isFolder: false,
    parentId: 'folder-video',
    size: 1548290000,
    updatedAt: '2026-03-24T10:25:00Z',
    category: 'video',
    extension: 'mp4',
    duration: '03:45',
    resolution: '3840x2160 (4K SVIP)',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'file-v2',
    name: 'Phim_Nhung_Chan_Troi_Moi_Trailer.mkv',
    isFolder: false,
    parentId: 'folder-video',
    size: 984500000,
    updatedAt: '2026-03-23T11:20:00Z',
    category: 'video',
    extension: 'mkv',
    duration: '02:18',
    resolution: '1920x1080 (FHD)',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },

  // Inside folder-docs
  {
    id: 'file-d1',
    name: 'Ke_Hoach_Phat_Trien_ZhangZhu_2026.docx',
    isFolder: false,
    parentId: 'folder-docs',
    size: 4892000,
    updatedAt: '2026-03-22T08:10:00Z',
    category: 'document',
    extension: 'docx',
    content: `# BÁO CÁO CHIẾN LƯỢC PHÁT TRIỂN ZHANGZHU DRIVE 2026

1. TỔNG QUAN HỆ THỐNG
ZhangZhu Drive (掌竹网盘) là nền tảng lưu trữ đám mây thế hệ mới kế thừa những tinh hoa vượt trội của Baidu Cloud:
- Tốc độ truyền tải siêu tốc độ qua mạng CDN phân tán.
- Tính năng chia sẻ liên kết có mật mã trích xuất (提取码) chuẩn xác, bảo mật cao.
- Trình xem trước đa phương tiện 4K, hỗ trợ đa định dạng tài liệu, âm thanh lossless và tệp nén trực tuyến.
- Không gian bảo mật (Safe Box) mã hóa 6 chữ số cá nhân.

2. MỤC TIÊU TĂNG TRƯỞNG
- Đạt 5.000.000 người dùng tích cực.
- Nâng cấp băng thông máy chủ tải ngoại tuyến lên tới 10 Gbps.
- Hỗ trợ xem trực tuyến file nén lên đến 20GB không cần giải nén.`,
  },
  {
    id: 'file-d2',
    name: 'Bang_Phan_Tich_Tai_Chinh_Q1.xlsx',
    isFolder: false,
    parentId: 'folder-docs',
    size: 2190000,
    updatedAt: '2026-03-21T16:00:00Z',
    category: 'document',
    extension: 'xlsx',
    content: `| Hạng mục | Dự toán (VNĐ) | Thực chi (VNĐ) | Tỷ lệ (%) |
|---|---|---|---|
| Máy chủ Cloud Storage | 120,000,000 | 115,000,000 | 95.8% |
| Băng thông CDN Siêu tốc | 85,000,000 | 80,000,000 | 94.1% |
| Hệ thống Bảo mật & Két sắt | 45,000,000 | 45,000,000 | 100.0% |
| Tải ngoại tuyến P2P Cluster | 60,000,000 | 58,000,000 | 96.6% |`,
  },

  // Inside folder-photos
  {
    id: 'file-p1',
    name: 'Hoang_Hon_Pho_Co_4K.jpg',
    isFolder: false,
    parentId: 'folder-photos',
    size: 14200000,
    updatedAt: '2026-03-20T14:35:00Z',
    category: 'picture',
    extension: 'jpg',
    resolution: '4096x2730',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 'file-p2',
    name: 'Bien_Xanh_Binh_Minh.png',
    isFolder: false,
    parentId: 'folder-photos',
    size: 9800000,
    updatedAt: '2026-03-19T09:12:00Z',
    category: 'picture',
    extension: 'png',
    resolution: '3840x2160',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
  },

  // Inside folder-music
  {
    id: 'file-m1',
    name: 'ZhangZhu_Bamboo_Melody_Lossless.flac',
    isFolder: false,
    parentId: 'folder-music',
    size: 48900000,
    updatedAt: '2026-03-18T18:45:00Z',
    category: 'audio',
    extension: 'flac',
    duration: '04:12',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },

  // Root files
  {
    id: 'file-root-guide',
    name: 'Huong_Dan_Su_Dung_ZhangZhu_Drive.pdf',
    isFolder: false,
    parentId: null,
    size: 3450000,
    updatedAt: '2026-03-25T09:00:00Z',
    category: 'document',
    extension: 'pdf',
    content: `# CHÀO MỪNG ĐẾN VỚI ZHANGZHU DRIVE (掌竹网盘)

Hệ thống sao chép chuẩn mực trải nghiệm lưu trữ đám mây Baidu Netdisk:
1. Tải lên và Tải xuống:
   - Hỗ trợ tải tệp lớn lên đến 20GB đối với tài khoản SVIP.
   - Chế độ "极速下载" (Tăng tốc cực hạn) phá vỡ giới hạn băng thông.

2. Chia sẻ tệp thông minh:
   - Tạo mã chia sẻ kèm Mật mã trích xuất (提取码) 4 ký tự độc quyền.
   - Hạn dùng tùy chỉnh: 1 ngày, 7 ngày, 30 ngày hoặc Vĩnh viễn.

3. Tải ngoại tuyến (Offline Download):
   - Hỗ trợ dán đường dẫn HTTP, HTTPS, FTP hoặc Magnet URI.
   - Đám mây tự động nạp tệp về kho lưu trữ chỉ sau vài giây.

4. Két sắt an toàn (Safe Box / 密码箱):
   - Bảo mật 6 chữ số giúp ẩn giấu các tài liệu mật, không hiển thị ở danh mục thường.`,
  },
  {
    id: 'file-root-zip',
    name: 'Bo_Ma_Nguon_Du_An_Web_2026.zip',
    isFolder: false,
    parentId: null,
    size: 154800000,
    updatedAt: '2026-03-24T15:20:00Z',
    category: 'archive',
    extension: 'zip',
    archiveEntries: [
      { name: 'src/components/DriveHeader.tsx', size: 14200, isFolder: false },
      { name: 'src/components/FileList.tsx', size: 28400, isFolder: false },
      { name: 'src/components/VideoPlayerModal.tsx', size: 19800, isFolder: false },
      { name: 'src/components/SafeBoxModal.tsx', size: 15100, isFolder: false },
      { name: 'src/assets/logo.svg', size: 4800, isFolder: false },
      { name: 'package.json', size: 1200, isFolder: false },
      { name: 'README.md', size: 3400, isFolder: false },
    ],
  },
  {
    id: 'file-root-photo',
    name: 'Wallpaper_Bamboo_Forest_ZhangZhu.png',
    isFolder: false,
    parentId: null,
    size: 12800000,
    updatedAt: '2026-03-24T12:00:00Z',
    category: 'picture',
    extension: 'png',
    resolution: '3840x2160',
    thumbnail: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=1600&auto=format&fit=crop&q=80',
  },

  // Safe box files (only visible inside safe box)
  {
    id: 'file-safe-1',
    name: 'Hop_Dong_Bao_Mat_Thuong_Mai.pdf',
    isFolder: false,
    parentId: null,
    size: 5120000,
    updatedAt: '2026-03-15T11:00:00Z',
    category: 'document',
    extension: 'pdf',
    isSafeBox: true,
    content: `BẢN HỢP ĐỒNG KINH TẾ BẢO MẬT TUYỆT ĐỐI
Mã định danh bảo mật: ZZ-SAFE-888999
Tất cả các điều khoản lưu trữ trên ZhangZhu Drive được bảo vệ với chữ ký số chuẩn AES-256.`,
  },
  {
    id: 'file-safe-2',
    name: 'Sao_Luu_Khoa_Bi_Mat_PrivateKey.txt',
    isFolder: false,
    parentId: null,
    size: 24500,
    updatedAt: '2026-03-14T09:30:00Z',
    category: 'document',
    extension: 'txt',
    isSafeBox: true,
    content: `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI10lZ0aXQ7yQCAggA
MBQGCCqGSIb3DQMHBAhMZZDrive77w==
-----END ENCRYPTED PRIVATE KEY-----`,
  },

  // Trash files
  {
    id: 'file-trash-1',
    name: 'Ban_Nhao_Giao_Dien_Cu_2025.sketch',
    isFolder: false,
    parentId: null,
    size: 32000000,
    updatedAt: '2026-02-10T14:00:00Z',
    category: 'other',
    extension: 'sketch',
    inTrash: true,
  },
];

export const INITIAL_SHARED_LINKS: SharedLink[] = [
  {
    id: 'share-1',
    code: '8zk19pba',
    extractCode: '8888',
    itemIds: ['file-root-guide'],
    itemsSummary: [
      {
        name: 'Huong_Dan_Su_Dung_ZhangZhu_Drive.pdf',
        size: 3450000,
        isFolder: false,
        category: 'document',
      },
    ],
    createdAt: '2026-03-24T09:00:00Z',
    expiresAt: null,
    expiryLabel: 'Vĩnh viễn',
    downloadCount: 142,
    viewCount: 685,
  },
  {
    id: 'share-2',
    code: 'm4n20k8q',
    extractCode: '6666',
    itemIds: ['file-root-zip'],
    itemsSummary: [
      {
        name: 'Bo_Ma_Nguon_Du_An_Web_2026.zip',
        size: 154800000,
        isFolder: false,
        category: 'archive',
      },
    ],
    createdAt: '2026-03-23T16:30:00Z',
    expiresAt: '2026-04-23T16:30:00Z',
    expiryLabel: '30 ngày',
    downloadCount: 89,
    viewCount: 310,
  },
];

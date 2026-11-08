import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  getFileExtension,
  getFileCategory,
  generateExtractionCode,
  generateShareCode,
  sortItems,
  searchAndFilterItems,
  buildBreadcrumbPath,
} from './fileUtils.ts';
import { DriveItem } from '../types/drive.ts';

test('formatBytes correctly formats sizes', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(1073741824), '1 GB');
  assert.equal(formatBytes(5368709120), '5 GB');
});

test('getFileExtension correctly extracts lowercase extension', () => {
  assert.equal(getFileExtension('movie.mp4'), 'mp4');
  assert.equal(getFileExtension('document.PDF'), 'pdf');
  assert.equal(getFileExtension('archive.tar.gz'), 'gz');
  assert.equal(getFileExtension('noextension'), '');
});

test('getFileCategory categorizes extensions properly', () => {
  assert.equal(getFileCategory('photo.jpg'), 'picture');
  assert.equal(getFileCategory('report.docx'), 'document');
  assert.equal(getFileCategory('video.mkv'), 'video');
  assert.equal(getFileCategory('song.mp3'), 'audio');
  assert.equal(getFileCategory('backup.zip'), 'archive');
  assert.equal(getFileCategory('unknown.xyz'), 'other');
  assert.equal(getFileCategory('folder_name', true), 'other');
});

test('generateExtractionCode generates 4-character code', () => {
  const code = generateExtractionCode();
  assert.equal(code.length, 4);
  assert.match(code, /^[a-z0-9]{4}$/);
});

test('generateShareCode generates 8-character code', () => {
  const code = generateShareCode();
  assert.equal(code.length, 8);
});

test('sortItems puts folders first and sorts correctly', () => {
  const mockItems: DriveItem[] = [
    {
      id: '1',
      name: 'beta.txt',
      isFolder: false,
      parentId: null,
      size: 200,
      updatedAt: '2026-01-02',
      category: 'document',
    },
    {
      id: '2',
      name: 'alpha_folder',
      isFolder: true,
      parentId: null,
      size: 0,
      updatedAt: '2026-01-01',
      category: 'other',
    },
    {
      id: '3',
      name: 'alpha.txt',
      isFolder: false,
      parentId: null,
      size: 100,
      updatedAt: '2026-01-03',
      category: 'document',
    },
  ];

  const sortedByName = sortItems(mockItems, 'name', 'asc');
  assert.equal(sortedByName[0].name, 'alpha_folder'); // folder first
  assert.equal(sortedByName[1].name, 'alpha.txt');
  assert.equal(sortedByName[2].name, 'beta.txt');

  const sortedBySize = sortItems(mockItems, 'size', 'desc');
  assert.equal(sortedBySize[0].name, 'alpha_folder'); // folder still first
  assert.equal(sortedBySize[1].name, 'beta.txt'); // 200 > 100
  assert.equal(sortedBySize[2].name, 'alpha.txt');
});

test('buildBreadcrumbPath tracks nested hierarchy', () => {
  const mockFolders: DriveItem[] = [
    {
      id: 'f1',
      name: 'Tài liệu học tập',
      isFolder: true,
      parentId: null,
      size: 0,
      updatedAt: '2026-01-01',
      category: 'other',
    },
    {
      id: 'f2',
      name: 'Lập trình',
      isFolder: true,
      parentId: 'f1',
      size: 0,
      updatedAt: '2026-01-02',
      category: 'other',
    },
  ];

  const path = buildBreadcrumbPath('f2', mockFolders);
  assert.equal(path.length, 3);
  assert.equal(path[0].name, 'Tất cả tệp');
  assert.equal(path[1].name, 'Tài liệu học tập');
  assert.equal(path[2].name, 'Lập trình');
});

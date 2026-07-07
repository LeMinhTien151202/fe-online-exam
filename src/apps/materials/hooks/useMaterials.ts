import { useState, useMemo } from 'react';
import { useStudyMaterialsQuery } from '../services/materialQuery';
import { IMaterial, IStudyMaterial, SKILL_ID_TO_LABEL } from '../services/types';
import { getFileMeta } from '../services/fileFormat';

// giây -> "mm:ss"
const formatDuration = (seconds: number | null): string => {
  if (!seconds || seconds <= 0) return 'Video bài giảng';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const mapToCard = (m: IStudyMaterial): IMaterial => {
  const meta = getFileMeta(m.fileUrl, m.fileType);
  // Ưu tiên nhãn tiếng Việt theo skillId để khớp các tab lọc; fallback tên skill từ API
  const skill = (m.skillId ? SKILL_ID_TO_LABEL[m.skillId] : '') || m.skill?.name || 'Tổng hợp';
  return {
    key: String(m.id),
    id: m.id,
    name: m.title,
    skill,
    kind: meta.kind,
    formatLabel: meta.label,
    color: meta.color,
    bg: meta.bg,
    fileUrl: m.fileUrl,
    size: meta.kind === 'video' ? formatDuration(m.durationSeconds) : `Tài liệu ${meta.label}`,
    description: `Tài liệu ${meta.label} ôn luyện Aptis.`,
  };
};

export const useMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('Tất cả');

  // Lấy nhiều tài liệu 1 lần rồi lọc phía client (trang học viên không có phân trang)
  const { data, isLoading } = useStudyMaterialsQuery({ page: 1, limit: 100 });

  const materials = useMemo(() => (data?.data ?? []).map(mapToCard), [data]);

  // Bộ lọc định dạng dựng động theo các nhóm thực có trong dữ liệu
  const formatOptions = useMemo(() => {
    const seen = new Map<string, string>();
    materials.forEach((m) => seen.set(m.kind, m.formatLabel));
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        material.name.toLowerCase().includes(keyword) ||
        material.description.toLowerCase().includes(keyword);

      const matchesType = fileTypeFilter === 'all' ? true : material.kind === fileTypeFilter;
      const matchesTab = activeTab === 'Tất cả' ? true : material.skill === activeTab;

      return matchesSearch && matchesType && matchesTab;
    });
  }, [materials, searchQuery, fileTypeFilter, activeTab]);

  return {
    isLoading,
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    activeTab,
    setActiveTab,
    formatOptions,
    filteredMaterials,
  };
};

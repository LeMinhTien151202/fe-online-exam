import { useState, useMemo } from 'react';
import { mockMaterials } from '../services/mockData';

export const useMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('Tất cả');

  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter((material) => {
      // 1. Search Query filter
      const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        material.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. File Type filter (PDF / DOCX)
      let matchesType = true;
      if (fileTypeFilter === 'pdf') {
        matchesType = material.format === 'pdf';
      } else if (fileTypeFilter === 'docx') {
        matchesType = material.format === 'word';
      }

      // 3. Category Tab filter
      let matchesTab = true;
      if (activeTab !== 'Tất cả') {
        matchesTab = material.skill === activeTab;
      }

      return matchesSearch && matchesType && matchesTab;
    });
  }, [searchQuery, fileTypeFilter, activeTab]);

  return {
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    activeTab,
    setActiveTab,
    filteredMaterials,
  };
};

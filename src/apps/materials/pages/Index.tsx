import React, { useState } from 'react';
import { Typography, Drawer, Button, Spin } from 'antd';
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileTextOutlined,
  FileOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  DownloadOutlined,
  SearchOutlined,
  BellOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';

// Component layout imports
import { Sidebar } from '../../home/components/Sidebar';
import * as S from '../../home/pages/styled';
import * as M from '../styles/styled';

// Custom Hooks
import { useMaterials } from '../hooks/useMaterials';

const { Title, Text } = Typography;

export const MaterialsPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    activeTab,
    setActiveTab,
    formatOptions,
    filteredMaterials,
  } = useMaterials();

  const tabs = ['Tất cả', 'Ngữ pháp & Từ vựng', 'Đọc', 'Nghe', 'Nói', 'Viết'];

  // Icon theo nhóm định dạng file
  const kindIcon: Record<string, React.ReactNode> = {
    pdf: <FilePdfOutlined />,
    word: <FileWordOutlined />,
    excel: <FileExcelOutlined />,
    ppt: <FilePptOutlined />,
    video: <PlayCircleOutlined />,
    image: <FileImageOutlined />,
    audio: <SoundOutlined />,
    archive: <FileZipOutlined />,
    text: <FileTextOutlined />,
    file: <FileOutlined />,
  };

  return (
    <S.MainLayout>
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Sidebar Mobile */}
      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        bodyStyle={{ padding: 0, background: '#0d2245' }}
        width={280}
        closable={false}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </Drawer>

      <S.RightColumn>
        {/* Mobile Header */}
        <S.MobileHeader>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <S.HeaderLogo src="/image.png" alt="Logo" />
            <S.HeaderTitle>Aptis Prep</S.HeaderTitle>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button type="text" icon={<BellOutlined />} />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </S.MobileHeader>

        <M.CustomContentArea>
          <S.Container>
            <M.PageHeader>
              <Title level={2} style={{ color: '#0d2245', fontWeight: 800, margin: 0 }}>
                Tài liệu học tập
              </Title>
              <Text type="secondary" style={{ fontSize: '0.9375rem' }}>
                Tổng hợp tài liệu PDF, DOCX ôn luyện Aptis chuẩn từ giáo viên chuyên môn.
              </Text>
            </M.PageHeader>

            {/* Filter and Search Bar */}
            <M.FilterSection>
              <M.SearchWrapper>
                <M.StyledInput
                  placeholder="Tìm tên tài liệu..."
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear
                />
              </M.SearchWrapper>

              <M.StyledSelect
                defaultValue="all"
                value={fileTypeFilter}
                onChange={(value) => setFileTypeFilter(value as string)}
              >
                <SelectOption value="all">Tất cả định dạng</SelectOption>
                {formatOptions.map((opt) => (
                  <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
                ))}
              </M.StyledSelect>
            </M.FilterSection>

            {/* Skill Tab Navigation */}
            <M.TabBar>
              {tabs.map((tab) => (
                <M.TabItem
                  key={tab}
                  $active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </M.TabItem>
              ))}
            </M.TabBar>

            {/* Materials Grid list */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Spin size="large" />
              </div>
            ) : filteredMaterials.length > 0 ? (
              <M.MaterialsGrid>
                {filteredMaterials.map((doc) => (
                  <M.MaterialCard key={doc.key}>
                    <M.CardHeader>
                      <M.FileIconWrapper $bg={doc.bg} $color={doc.color}>
                        {kindIcon[doc.kind] ?? <FileOutlined />}
                      </M.FileIconWrapper>
                      <M.CardContent>
                        <M.DocTitle title={doc.name}>{doc.name}</M.DocTitle>
                        <M.DocDescription title={doc.description}>{doc.description}</M.DocDescription>
                      </M.CardContent>
                    </M.CardHeader>

                    <M.TagRow>
                      <M.SkillTag $skill={doc.skill}>{doc.skill}</M.SkillTag>
                      <M.FormatTag>{doc.formatLabel}</M.FormatTag>
                    </M.TagRow>

                    <M.CardFooter>
                      <M.FileSize>{doc.size}</M.FileSize>
                      <M.DownloadBtn
                        title={doc.kind === 'video' ? 'Xem video' : 'Mở / tải tài liệu'}
                        onClick={() => window.open(doc.fileUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <DownloadOutlined />
                      </M.DownloadBtn>
                    </M.CardFooter>
                  </M.MaterialCard>
                ))}
              </M.MaterialsGrid>
            ) : (
              <M.EmptyState>
                <Title level={4} style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>
                  Không tìm thấy tài liệu phù hợp
                </Title>
                <Text type="secondary">
                  Thử thay đổi từ khóa tìm kiếm hoặc chuyển sang bộ lọc định dạng khác.
                </Text>
              </M.EmptyState>
            )}

            {/* Footer */}
            <S.Footer>
              <S.CopyrightText>
                © 2024 Trung tâm Luyện thi Aptis Prep. Bảo lưu mọi quyền.
              </S.CopyrightText>
              <S.FooterLinks>
                <a href="/" onClick={(e) => e.preventDefault()}>Chính sách Bảo mật</a>
                <a href="/" onClick={(e) => e.preventDefault()}>Điều khoản Dịch vụ</a>
                <a href="/" onClick={(e) => e.preventDefault()}>Trung tâm Trợ giúp</a>
                <a href="/" onClick={(e) => e.preventDefault()}>Liên hệ</a>
              </S.FooterLinks>
            </S.Footer>
          </S.Container>
        </M.CustomContentArea>
      </S.RightColumn>
    </S.MainLayout>
  );
};

// Ant Design Option helper wrapper
const SelectOption: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  return <M.StyledSelect.Option value={value}>{children}</M.StyledSelect.Option>;
};

export default MaterialsPage;

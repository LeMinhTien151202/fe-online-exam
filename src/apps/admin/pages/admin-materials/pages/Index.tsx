import React from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Typography,
  Space,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  UploadOutlined,
  FilePdfOutlined,
  AudioOutlined,
  PlaySquareOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  FileZipOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useMaterials } from '../hook/useMaterials';
import MaterialModal from '../components/MaterialModal';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';
import type { FileType } from '../services/types';

const { Title, Text } = Typography;

const MaterialsIndex: React.FC = () => {
  const {
    materials,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange,
    search,
    skillId,
    fileType,
    changeSearch,
    changeSkill,
    changeFileType,
    isModalOpen,
    editingMaterial,
    closeModal,
    isSaving,
    openCreate,
    openEdit,
    handleSaveMaterial,
    handleDelete,
  } = useMaterials();

  const getFormatIcon = (format: string) => {
    const style = { fontSize: '32px' };
    switch (format) {
      case 'pdf': return <FilePdfOutlined style={{ ...style, color: '#ef4444' }} />;
      case 'audio': return <AudioOutlined style={{ ...style, color: '#8b5cf6' }} />;
      case 'video': return <PlaySquareOutlined style={{ ...style, color: '#3b82f6' }} />;
      case 'docx': return <FileWordOutlined style={{ ...style, color: '#2563eb' }} />;
      case 'xlsx': return <FileExcelOutlined style={{ ...style, color: '#16a34a' }} />;
      case 'pptx': return <PlaySquareOutlined style={{ ...style, color: '#f97316' }} />;
      case 'zip': return <FileZipOutlined style={{ ...style, color: '#64748b' }} />;
      case 'link': return <LinkOutlined style={{ ...style, color: '#0ea5e9' }} />;
      default: return <FilePdfOutlined style={{ ...style, color: '#6b7280' }} />;
    }
  };

  return (
    <S.Container>
      <S.Header>
        <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
          Tài liệu học tập
        </Title>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={openCreate}
          style={{ background: ADMIN_COLORS.primary }}
        >
          Đăng tải tài liệu mới
        </Button>
      </S.Header>

      {/* Filter toolbar */}
      <Card size="small" bordered={false}>
        <S.FilterBar>
          <Input value={search} onChange={(event) => changeSearch(event.target.value)}
            placeholder="Tìm tên tài liệu..." prefix={<SearchOutlined />} style={{ width: 260 }} allowClear />
          <Select value={skillId} onChange={changeSkill} placeholder="Chọn kỹ năng" style={{ width: 170 }} allowClear>
            <Select.Option value={1}>Ngữ pháp & Từ vựng</Select.Option>
            <Select.Option value={3}>Đọc hiểu</Select.Option>
            <Select.Option value={2}>Nghe</Select.Option>
            <Select.Option value={5}>Nói</Select.Option>
            <Select.Option value={4}>Viết</Select.Option>
          </Select>
          <Select<FileType> value={fileType} onChange={changeFileType}
            placeholder="Định dạng file" style={{ width: 170 }} allowClear>
            {(['PDF', 'AUDIO', 'VIDEO', 'DOCX', 'PPTX', 'XLSX', 'ZIP', 'LINK'] as FileType[]).map((type) => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </S.FilterBar>
      </Card>

      {/* Grid of material cards */}
      {isLoading && <Spin />}
      <Row gutter={[16, 16]}>
        {materials.map(material => (
          <Col xs={24} sm={12} md={8} xl={6} key={material.key}>
            <Card
              hoverable
              actions={[
                <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => window.open(material.fileUrl, '_blank')} key="download" />,
                <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(material)} key="edit" />,
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(material.id)} key="delete" />,
              ]}
            >
              <S.MaterialCardContent>
                {getFormatIcon(material.format)}
                <S.MaterialCardInfo>
                  <Text strong style={{ fontSize: '13px', lineHeight: 1.3 }} ellipsis={{ tooltip: material.name }}>
                    {material.name}
                  </Text>
                  <Space style={{ flexWrap: 'wrap' }}>
                    {material.skillLabel && <Tag color="cyan" style={{ fontSize: '10px' }}>{material.skillLabel}</Tag>}
                    <Tag color={material.fileType === 'VIDEO' ? 'blue' : 'red'} style={{ fontSize: '10px' }}>{material.fileType}</Tag>
                  </Space>
                </S.MaterialCardInfo>
              </S.MaterialCardContent>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '2rem' }}>
        <AppPagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>

      {/* Upload Modal */}
      <MaterialModal
        open={isModalOpen}
        initialValue={editingMaterial}
        onCancel={closeModal}
        onSuccess={handleSaveMaterial}
        isSaving={isSaving}
      />
    </S.Container>
  );
};

export default MaterialsIndex;

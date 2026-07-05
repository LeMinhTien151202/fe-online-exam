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
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useMaterials } from '../hook/useMaterials';
import MaterialModal from '../components/MaterialModal';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';

const { Title, Text } = Typography;

const MaterialsIndex: React.FC = () => {
  const {
    materials,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange,
    isModalOpen,
    setIsModalOpen,
    isSaving,
    handleUploadClick,
    handleSaveMaterial,
    handleDelete,
  } = useMaterials();

  const getFormatIcon = (format: string) => {
    const style = { fontSize: '32px' };
    switch (format) {
      case 'pdf': return <FilePdfOutlined style={{ ...style, color: '#ef4444' }} />;
      case 'audio': return <AudioOutlined style={{ ...style, color: '#8b5cf6' }} />;
      case 'video': return <PlaySquareOutlined style={{ ...style, color: '#3b82f6' }} />;
      case 'word': return <FileWordOutlined style={{ ...style, color: '#2563eb' }} />;
      case 'excel': return <FileExcelOutlined style={{ ...style, color: '#16a34a' }} />;
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
          onClick={handleUploadClick}
          style={{ background: ADMIN_COLORS.primary }}
        >
          Đăng tải tài liệu mới
        </Button>
      </S.Header>

      {/* Filter toolbar */}
      <Card size="small" bordered={false}>
        <S.FilterBar>
          <Input placeholder="Tìm tên tài liệu..." prefix={<SearchOutlined />} style={{ width: 260 }} />
          <Select placeholder="Chọn kỹ năng" style={{ width: 150 }} allowClear>
            <Select.Option value="Grammar">Ngữ pháp & Từ vựng</Select.Option>
            <Select.Option value="Reading">Đọc hiểu</Select.Option>
            <Select.Option value="Listening">Nghe</Select.Option>
            <Select.Option value="Speaking">Nói</Select.Option>
            <Select.Option value="Writing">Viết</Select.Option>
          </Select>
          <Select placeholder="Định dạng file" style={{ width: 140 }} allowClear>
            <Select.Option value="pdf">PDF (.pdf)</Select.Option>
            <Select.Option value="audio">Audio (.mp3)</Select.Option>
            <Select.Option value="video">Video (.mp4)</Select.Option>
            <Select.Option value="word">Word (.docx)</Select.Option>
          </Select>
          <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
            <Select.Option value="approved">Đã duyệt</Select.Option>
            <Select.Option value="pending">Chờ duyệt</Select.Option>
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
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(material.key)} key="delete" />,
              ]}
            >
              <S.MaterialCardContent>
                {getFormatIcon(material.format)}
                <S.MaterialCardInfo>
                  <Text strong style={{ fontSize: '13px', lineHeight: 1.3 }} ellipsis={{ tooltip: material.name }}>
                    {material.name}
                  </Text>
                  <Space style={{ flexWrap: 'wrap' }}>
                    {material.skill && <Tag color="cyan" style={{ fontSize: '10px' }}>{material.skill}</Tag>}
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
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleSaveMaterial}
        isSaving={isSaving}
      />
    </S.Container>
  );
};

export default MaterialsIndex;

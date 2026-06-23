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
  Drawer,
  Upload,
  Radio,
  Form,
  Space,
  message,
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
  InboxOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useMaterials } from '../hook/useMaterials';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const MaterialsIndex: React.FC = () => {
  const {
    materials,
    isDrawerOpen,
    setIsDrawerOpen,
    form,
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
      <Row gutter={[16, 16]}>
        {materials.map(material => (
          <Col xs={24} sm={12} md={8} xl={6} key={material.key}>
            <Card
              hoverable
              actions={[
                <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => message.info('Tải tài liệu này về...')} key="download" />,
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
                    <Tag color="cyan" style={{ fontSize: '10px' }}>{material.skill}</Tag>
                    <Tag color={material.status === 'approved' ? 'success' : 'warning'} style={{ fontSize: '10px' }}>
                      {material.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </Tag>
                  </Space>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{material.downloads} tải</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{material.size}</Text>
                  </div>
                </S.MaterialCardInfo>
              </S.MaterialCardContent>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '2rem' }}>
        <AppPagination
          current={1}
          total={materials.length}
          pageSize={12}
          onChange={() => { }}
        />
      </div>

      {/* Upload Drawer */}
      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>Đăng tải tài liệu</Title>}
        placement="right"
        width={500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveMaterial}>
          <Form.Item label="Tải lên tệp tin" name="file" rules={[{ required: true, message: 'Hãy chọn file tải lên!' }]}>
            <Dragger maxCount={1} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: ADMIN_COLORS.primary }} />
              </p>
              <p className="ant-upload-text">Kéo thả tệp tin hoặc click để chọn</p>
              <p className="ant-upload-hint">
                Hỗ trợ định dạng PDF, MP3, MP4, DOCX, XLSX. Kích thước tối đa 50MB.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item label="Tên tài liệu" name="name" rules={[{ required: true, message: 'Nhập tên tài liệu!' }]}>
            <Input placeholder="Tên hiển thị cho học viên..." />
          </Form.Item>

          <Form.Item label="Kỹ năng chính" name="skill" rules={[{ required: true, message: 'Chọn kỹ năng liên quan!' }]}>
            <Select placeholder="Chọn kỹ năng">
              <Select.Option value="Grammar">Ngữ pháp & Từ vựng</Select.Option>
              <Select.Option value="Reading">Đọc hiểu</Select.Option>
              <Select.Option value="Listening">Nghe</Select.Option>
              <Select.Option value="Speaking">Nói</Select.Option>
              <Select.Option value="Writing">Viết</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả chi tiết" name="description">
            <Input.TextArea placeholder="Thông tin tóm tắt nội dung tài liệu..." rows={3} />
          </Form.Item>

          <Form.Item label="Quyền truy cập" name="accessLimit" initialValue="public">
            <Radio.Group>
              <Radio value="public">Tất cả học viên</Radio>
              <Radio value="pro">Chỉ học viên gói Pro</Radio>
              <Radio value="premium">Chỉ học viên gói Premium</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: '2rem' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsDrawerOpen(false)}>Huỷ</Button>
              <Button type="primary" htmlType="submit" style={{ background: ADMIN_COLORS.primary }}>
                Đăng tải tài liệu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </S.Container>
  );
};

export default MaterialsIndex;

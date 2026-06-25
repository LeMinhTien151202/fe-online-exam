import React from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Upload, Space, Table, InputNumber, Tag, Typography, Row, Col } from 'antd';
import { SaveOutlined, UploadOutlined, SafetyCertificateOutlined, SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useSettings } from '../hook/useSettings';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const SettingsIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    auditLogs,
    packages,
    handleSaveGeneral,
  } = useSettings();

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        Cài đặt hệ thống
      </Title>

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none', marginTop: '1rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'general',
              label: <Space><SettingOutlined />Cài đặt chung</Space>,
              children: (
                <Form layout="vertical" onFinish={handleSaveGeneral} style={{ padding: '1.5rem 0' }}>
                  <Row gutter={48}>
                    <Col xs={24} lg={12}>
                      <Title level={5} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 4, height: 16, background: ADMIN_COLORS.primary, borderRadius: 2 }} />
                        Thông tin cơ bản
                      </Title>
                      <Form.Item label="Tên nền tảng" name="appName" initialValue="Aptis Prep Online">
                        <Input placeholder="Ví dụ: Aptis Prep Online" />
                      </Form.Item>
                      <Form.Item label="Mô tả nền tảng" name="appDesc" initialValue="Nền tảng luyện thi thử Aptis tốt nhất Việt Nam">
                        <Input.TextArea rows={4} placeholder="Mô tả ngắn gọn về website..." />
                      </Form.Item>
                      <Form.Item label="Logo nền tảng">
                        <Upload maxCount={1} beforeUpload={() => false}>
                          <Button icon={<UploadOutlined />} style={{ borderRadius: '8px' }}>Tải Logo mới</Button>
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Title level={5} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 4, height: 16, background: ADMIN_COLORS.primary, borderRadius: 2 }} />
                        Cấu hình kỹ thuật
                      </Title>
                      <Form.Item label="Màu chủ đạo Primary color (Hex)" name="primaryHex" initialValue="#1a365d">
                        <Input prefix={<div style={{ width: 16, height: 16, background: '#1a365d', borderRadius: '50%' }} />} />
                      </Form.Item>

                      <Form.Item label="Giới hạn dung lượng tệp tin tải lên (MB)" name="maxUpload" initialValue={50}>
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>

                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                        <Form.Item label="Tự động gửi email thông báo kết quả thi" name="sendMailNotify" valuePropName="checked" initialValue={true} style={{ marginBottom: '1rem' }}>
                          <Switch />
                        </Form.Item>

                        <Form.Item label="Tự động gửi email nhắc nhở học viên hàng ngày" name="sendMailStreak" valuePropName="checked" initialValue={false} style={{ marginBottom: 0 }}>
                          <Switch />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: ADMIN_COLORS.primary, height: '40px', padding: '0 2rem', borderRadius: '8px' }}>
                      Lưu cài đặt hệ thống
                    </Button>
                  </div>
                </Form>
              ),
            },
            {
              key: 'packages',
              label: <Space><SafetyCertificateOutlined />Quản lý gói học tập</Space>,
              children: (
                <Table
                  dataSource={packages}
                  pagination={false}
                  size="middle"
                  columns={[
                    {
                      title: 'Tên gói',
                      dataIndex: 'name',
                      key: 'name',
                      render: (name: string) => <Tag color={name === 'Premium' ? 'gold' : name === 'Pro' ? 'blue' : 'default'}>{name}</Tag>,
                    },
                    { title: 'Giá cước', dataIndex: 'price', key: 'price', render: (val: string) => <Text strong>{val}</Text> },
                    { title: 'Tính năng cốt lõi', dataIndex: 'features', key: 'features' },
                    { title: 'Học viên đăng ký', dataIndex: 'userCount', key: 'userCount' },
                    {
                      title: 'Hành động',
                      key: 'actions',
                      render: () => <Button type="link">Chỉnh sửa</Button>,
                    },
                  ]}
                />
              ),
            },
            {
              key: 'logs',
              label: <Space><HistoryOutlined />Nhật ký hệ thống</Space>,
              children: (
                <Table
                  dataSource={auditLogs}
                  pagination={{ pageSize: 10 }}
                  size="middle"
                  columns={[
                    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
                    { title: 'Người thực hiện', dataIndex: 'user', key: 'user', render: (val: string) => <Text strong>{val}</Text> },
                    { title: 'Hành động', dataIndex: 'action', key: 'action' },
                    { title: 'Module', dataIndex: 'module', key: 'module' },
                    { title: 'Nội dung chi tiết', dataIndex: 'detail', key: 'detail' },
                    { title: 'Địa chỉ IP', dataIndex: 'ip', key: 'ip' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>
    </S.Container>
  );
};

export default SettingsIndex;

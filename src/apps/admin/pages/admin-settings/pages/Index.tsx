import React from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Upload, Space, Table, InputNumber, Tag, Typography } from 'antd';
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

      <Card bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'general',
              label: <Space><SettingOutlined />Cài đặt chung</Space>,
              children: (
                <Form layout="vertical" onFinish={handleSaveGeneral} style={{ maxWidth: 600, padding: '1rem 0' }}>
                  <Form.Item label="Tên nền tảng" name="appName" initialValue="Aptis Prep Online">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Mô tả nền tảng" name="appDesc" initialValue="Nền tảng luyện thi thử Aptis tốt nhất Việt Nam">
                    <Input.TextArea rows={3} />
                  </Form.Item>

                  <Form.Item label="Logo nền tảng">
                    <Upload maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Tải Logo mới</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item label="Màu chủ đạo Primary color (Hex)" name="primaryHex" initialValue="#1a365d">
                    <Input prefix={<div style={{ width: 16, height: 16, background: '#1a365d', borderRadius: '50%' }} />} />
                  </Form.Item>

                  <Form.Item label="Giới hạn dung lượng tệp tin tải lên (MB)" name="maxUpload" initialValue={50}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item label="Tự động gửi email thông báo kết quả thi" name="sendMailNotify" valuePropName="checked" initialValue={true}>
                    <Switch />
                  </Form.Item>

                  <Form.Item label="Tự động gửi email nhắc nhở học viên hàng ngày" name="sendMailStreak" valuePropName="checked" initialValue={false}>
                    <Switch />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: ADMIN_COLORS.primary }}>
                      Lưu cài đặt
                    </Button>
                  </Form.Item>
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

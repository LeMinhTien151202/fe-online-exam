import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  ClockCircleOutlined,
  HistoryOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { UploadRequestOption } from '@rc-component/upload/lib/interface';
import { ADMIN_COLORS } from '../../../constants';
import { GeneralSettingsFormValues, useSettings } from '../hook/useSettings';
import MockDurationSettings from '../components/MockDurationSettings';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const SettingsIndex: React.FC = () => {
  const [form] = Form.useForm<GeneralSettingsFormValues>();
  const {
    activeTab,
    setActiveTab,
    auditLogs,
    packages,
    settingMap,
    generalSettings,
    maxUploadMb,
    isLoadingSettings,
    isSavingSetting,
    isUploadingLogo,
    handleSaveSetting,
    handleSaveGeneral,
    handleUploadLogo,
  } = useSettings();

  useEffect(() => {
    form.setFieldsValue(generalSettings);
  }, [form, generalSettings]);

  const checkUploadSize = (file: File) => {
    const isWithinLimit = file.size / 1024 / 1024 <= maxUploadMb;
    if (!isWithinLimit) {
      message.error(`Tệp vượt quá giới hạn ${maxUploadMb}MB.`);
    }
    return isWithinLimit;
  };

  const handleLogoUpload = async (options: UploadRequestOption) => {
    const logoUrl = await handleUploadLogo(options);
    form.setFieldValue('logoUrl', logoUrl);
  };

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        Cài đặt hệ thống
      </Title>

      <Card variant="borderless" styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none', marginTop: '1rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'durations',
              label: <Space><ClockCircleOutlined />Thời gian thi thử</Space>,
              children: (
                <MockDurationSettings
                  settingMap={settingMap}
                  isLoading={isLoadingSettings}
                  isSaving={isSavingSetting}
                  onSave={handleSaveSetting}
                />
              ),
            },
            {
              key: 'general',
              label: <Space><SettingOutlined />Cài đặt chung</Space>,
              children: (
                <Form<GeneralSettingsFormValues>
                  form={form}
                  layout="vertical"
                  onFinish={handleSaveGeneral}
                  style={{ padding: '1.5rem 0' }}
                  disabled={isLoadingSettings}
                >
                  <Row gutter={48}>
                    <Col xs={24} lg={12}>
                      <Title level={5} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 4, height: 16, background: ADMIN_COLORS.primary, borderRadius: 2 }} />
                        Thông tin nền tảng
                      </Title>

                      <Form.Item label="Tên nền tảng" name="appName" rules={[{ required: true, message: 'Nhập tên nền tảng' }]}>
                        <Input placeholder="Ví dụ: Aptis Prep Online" />
                      </Form.Item>

                      <Form.Item label="Mô tả nền tảng" name="appDescription">
                        <Input.TextArea rows={4} placeholder="Mô tả ngắn gọn về website..." />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Email hỗ trợ" name="supportEmail" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                            <Input placeholder="support@example.com" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label="Hotline hỗ trợ" name="supportPhone">
                            <Input placeholder="090..." />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item label="Logo nền tảng" name="logoUrl">
                        <Input placeholder="https://.../logo.png hoặc /image.png" />
                      </Form.Item>

                      <Space align="start" style={{ marginBottom: '1.5rem' }}>
                        <Upload
                          maxCount={1}
                          accept="image/*"
                          beforeUpload={checkUploadSize}
                          customRequest={handleLogoUpload}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} loading={isUploadingLogo} style={{ borderRadius: '8px' }}>
                            Tải logo mới
                          </Button>
                        </Upload>

                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) => {
                            const logoUrl = getFieldValue('logoUrl') as string | undefined;
                            return logoUrl ? (
                              <div style={{ width: 96, height: 48, border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' }}>
                                <img src={logoUrl} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                            ) : null;
                          }}
                        </Form.Item>
                      </Space>

                      <Form.Item label="Favicon URL" name="faviconUrl">
                        <Input placeholder="https://.../favicon.ico" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Title level={5} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 4, height: 16, background: ADMIN_COLORS.primary, borderRadius: 2 }} />
                        Giao diện & vận hành
                      </Title>

                      <Row gutter={12}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Màu chủ đạo" name="primaryColor" rules={[{ required: true, message: 'Nhập màu chủ đạo' }]}>
                            <Input prefix={<Form.Item shouldUpdate noStyle>{({ getFieldValue }) => <div style={{ width: 16, height: 16, background: getFieldValue('primaryColor') || '#1a365d', borderRadius: '50%', border: '1px solid #e2e8f0' }} />}</Form.Item>} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label="Màu phụ" name="secondaryColor">
                            <Input prefix={<Form.Item shouldUpdate noStyle>{({ getFieldValue }) => <div style={{ width: 16, height: 16, background: getFieldValue('secondaryColor') || '#3b5b8c', borderRadius: '50%', border: '1px solid #e2e8f0' }} />}</Form.Item>} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item label="Giới hạn dung lượng tệp tin tải lên" name="maxUploadMb" rules={[{ required: true, message: 'Nhập giới hạn upload' }]}>
                        <InputNumber min={1} max={500} addonAfter="MB" style={{ width: '100%' }} />
                      </Form.Item>

                      <Text type="secondary" style={{ display: 'block', marginTop: '1rem' }}>
                        Tên nền tảng, logo, favicon, màu chủ đạo và giới hạn dung lượng được áp dụng ngay trong khu vực quản trị sau khi lưu. Thông tin hỗ trợ và mô tả được lưu để hiển thị nơi khác khi backend đọc key tương ứng.
                      </Text>
                    </Col>
                  </Row>

                  <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={isSavingSetting}
                      style={{ background: ADMIN_COLORS.primary, height: '40px', padding: '0 2rem', borderRadius: '8px' }}
                    >
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

import React from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Switch,
  Tag,
  Avatar,
  Space,
  Typography,
  Drawer,
  Tabs,
  Progress,
  Checkbox,
  Card,
  message,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  TrophyOutlined,
  HistoryOutlined,
  FileOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useUsers } from '../hook/useUsers';
import * as S from '../styles/styled';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const UsersIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedStudent,
    drawerOpen,
    setDrawerOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleBulkLock,
    handleOpenDrawer,
  } = useUsers();

  const columns = [
    {
      title: 'Học viên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0)}</Avatar>
          <div>
            <Text strong style={{ fontSize: '13px' }}>{text}</Text>
            <div style={{ fontSize: '11px', color: ADMIN_COLORS.textSecondary }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Gói thành viên',
      dataIndex: 'package',
      key: 'package',
      render: (pkg: string) => (
        <Tag color={pkg === 'Premium' ? 'gold' : pkg === 'Pro' ? 'blue' : 'default'}>
          {pkg}
        </Tag>
      ),
    },
    {
      title: 'Tiến độ ôn tập',
      dataIndex: 'progress',
      key: 'progress',
      render: (prog: number) => (
        <div style={{ width: 140 }}>
          <Progress percent={prog} size="small" strokeColor={ADMIN_COLORS.primary} />
        </div>
      ),
    },
    {
      title: 'Chuỗi ngày',
      dataIndex: 'streak',
      key: 'streak',
      render: (streak: number) => (
        <Space>
          <span>🔥</span>
          <Text strong>{streak} ngày</Text>
        </Space>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',
      render: (target: string) => (
        <Tag color="cyan" style={{ fontWeight: 600 }}>
          {target}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'registeredDate',
      key: 'registeredDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          onChange={(checked) => handleStatusChange(checked, record.key)}
          size="small"
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: ADMIN_COLORS.primary }} />}
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            icon={record.active ? <LockOutlined style={{ color: ADMIN_COLORS.danger }} /> : <UnlockOutlined style={{ color: ADMIN_COLORS.success }} />}
            onClick={() => handleStatusChange(!record.active, record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <S.Container>
      <S.Header>
        <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
          Quản lý người dùng
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'list', label: 'Danh sách học viên' },
            { key: 'roles', label: 'Phân quyền & Vai trò' },
          ]}
        />
      </S.Header>

      {activeTab === 'list' ? (
        <Card bordered={false}>
          {/* Tool bar filter */}
          <S.FilterBar>
            <S.FilterRow>
              <Input
                placeholder="Tìm tên hoặc email..."
                prefix={<SearchOutlined />}
                style={{ width: 220 }}
              />
              <Select placeholder="Chọn gói" style={{ width: 120 }} allowClear>
                <Select.Option value="free">Miễn phí</Select.Option>
                <Select.Option value="pro">Pro</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
              </Select>
              <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Bị khóa</Select.Option>
              </Select>
              <Select placeholder="Mục tiêu" style={{ width: 100 }} allowClear>
                <Select.Option value="B1">B1</Select.Option>
                <Select.Option value="B2">B2</Select.Option>
                <Select.Option value="C">C</Select.Option>
              </Select>
              <RangePicker style={{ width: 260 }} />
            </S.FilterRow>
            <Space>
              <Button type="primary" style={{ background: ADMIN_COLORS.primary }}>Thêm học viên</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Space>
          </S.FilterBar>

          {/* Bulk actions */}
          {selectedRowKeys.length > 0 && (
            <S.BulkActionBar>
              <Text strong style={{ color: '#1e40af' }}>
                Đã chọn {selectedRowKeys.length} học viên
              </Text>
              <Space>
                <Button size="small" type="primary" danger onClick={handleBulkLock}>
                  Khóa tài khoản
                </Button>
                <Button size="small">Thay đổi gói</Button>
                <Button size="small" onClick={() => setSelectedRowKeys([])}>
                  Huỷ chọn
                </Button>
              </Space>
            </S.BulkActionBar>
          )}

          {/* Student Table */}
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={students}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      ) : (
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>Ma trận Phân quyền Vai trò</Title>
              <Text type="secondary">Cấp quyền chi tiết cho các nhóm vai trò trong hệ thống.</Text>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => message.success('Đã lưu cấu hình phân quyền!')}
              style={{ background: ADMIN_COLORS.success, borderColor: ADMIN_COLORS.success }}
            >
              Lưu cấu hình
            </Button>
          </div>

          <Table
            dataSource={permissions}
            pagination={false}
            columns={[
              {
                title: 'Hành động / Quyền hạn',
                dataIndex: 'action',
                key: 'action',
                render: (text: string) => <Text strong>{text}</Text>,
              },
              {
                title: 'Super Admin',
                dataIndex: 'superAdmin',
                key: 'superAdmin',
                render: (val: boolean, record: any) => (
                  <Checkbox
                    checked={val}
                    onChange={(e) => {
                      setPermissions(prev =>
                        prev.map(p => (p.key === record.key ? { ...p, superAdmin: e.target.checked } : p))
                      );
                    }}
                  />
                ),
              },
              {
                title: 'Admin',
                dataIndex: 'admin',
                key: 'admin',
                render: (val: boolean, record: any) => (
                  <Checkbox
                    checked={val}
                    onChange={(e) => {
                      setPermissions(prev =>
                        prev.map(p => (p.key === record.key ? { ...p, admin: e.target.checked } : p))
                      );
                    }}
                  />
                ),
              },
              {
                title: 'Giáo viên',
                dataIndex: 'teacher',
                key: 'teacher',
                render: (val: boolean, record: any) => (
                  <Checkbox
                    checked={val}
                    onChange={(e) => {
                      setPermissions(prev =>
                        prev.map(p => (p.key === record.key ? { ...p, teacher: e.target.checked } : p))
                      );
                    }}
                  />
                ),
              },
              {
                title: 'Học viên',
                dataIndex: 'student',
                key: 'student',
                render: (val: boolean, record: any) => (
                  <Checkbox
                    checked={val}
                    onChange={(e) => {
                      setPermissions(prev =>
                        prev.map(p => (p.key === record.key ? { ...p, student: e.target.checked } : p))
                      );
                    }}
                  />
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Student Detail Drawer */}
      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>Hồ sơ Học viên</Title>}
        placement="right"
        width={640}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header info */}
            <S.DrawerHeader>
              <Avatar size={64} style={{ backgroundColor: ADMIN_COLORS.primary, fontSize: '24px' }}>
                {selectedStudent.name.charAt(0)}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedStudent.name}</Title>
                <Text type="secondary" style={{ display: 'block' }}>{selectedStudent.email}</Text>
                <Space style={{ marginTop: '4px' }}>
                  <Tag color="gold">{selectedStudent.package}</Tag>
                  <Tag color="cyan">Mục tiêu: {selectedStudent.target}</Tag>
                </Space>
              </div>
            </S.DrawerHeader>

            {/* Inner Tabs */}
            <Tabs
              items={[
                {
                  key: 'progress',
                  label: <Space><TrophyOutlined />Tiến độ học</Space>,
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                           <Text>Ngữ pháp & Từ vựng</Text>
                          <Text strong>85%</Text>
                        </div>
                        <Progress percent={85} strokeColor="#f97316" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>Đọc hiểu</Text>
                          <Text strong>70%</Text>
                        </div>
                        <Progress percent={70} strokeColor="#0ea5e9" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>Nghe</Text>
                          <Text strong>65%</Text>
                        </div>
                        <Progress percent={65} strokeColor="#8b5cf6" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>Nói</Text>
                          <Text strong>40%</Text>
                        </div>
                        <Progress percent={40} strokeColor="#f43f5e" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>Viết</Text>
                          <Text strong>55%</Text>
                        </div>
                        <Progress percent={55} strokeColor="#10b981" />
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'history',
                  label: <Space><HistoryOutlined />Lịch sử thi</Space>,
                  children: (
                    <Table
                      dataSource={[
                        { key: '1', date: '01/06/2026', skill: 'Reading', test: 'Bộ đề Đọc #2', score: '42/50', time: '22:15' },
                        { key: '2', date: '28/05/2026', skill: 'Listening', test: 'Bộ đề Nghe #1', score: '35/50', time: '30:00' },
                        { key: '3', date: '25/05/2026', skill: 'Writing', test: 'Bộ đề Viết #4', score: '78/100', time: '45:00' },
                      ]}
                      pagination={false}
                      size="small"
                      columns={[
                        { title: 'Ngày làm', dataIndex: 'date', key: 'date' },
                        {
                          title: 'Kỹ năng',
                          dataIndex: 'skill',
                          key: 'skill',
                          render: (s: string) => (
                            <Tag color={s === 'Reading' ? 'blue' : s === 'Listening' ? 'purple' : 'green'}>{s}</Tag>
                          ),
                        },
                        { title: 'Bài thi', dataIndex: 'test', key: 'test' },
                        { title: 'Điểm', dataIndex: 'score', key: 'score' },
                      ]}
                    />
                  ),
                },
                {
                  key: 'files',
                  label: <Space><FileOutlined />Tài liệu tải</Space>,
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.5rem 0' }}>
                      <Card size="small" hoverable>
                        <Space>
                          <span style={{ fontSize: '24px', color: '#ef4444' }}>📕</span>
                          <div>
                            <Text strong style={{ display: 'block', fontSize: '12px' }}>Aptis_Grammar_Master.pdf</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>Tải ngày 24/05/2026</Text>
                          </div>
                        </Space>
                      </Card>
                      <Card size="small" hoverable>
                        <Space>
                          <span style={{ fontSize: '24px', color: '#3b82f6' }}>📘</span>
                          <div>
                            <Text strong style={{ display: 'block', fontSize: '12px' }}>Reading_Part3_Tips.docx</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>Tải ngày 26/05/2026</Text>
                          </div>
                        </Space>
                      </Card>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </S.Container>
  );
};

export default UsersIndex;

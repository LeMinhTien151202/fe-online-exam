import React from 'react';
import { Col, Row, Card, Table, Timeline, Typography, Avatar, Tag, Space, Progress } from 'antd';
import {
  UserOutlined,
  FireOutlined,
  CheckCircleOutlined,
  FileOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { ADMIN_COLORS } from '../../../constants';
import { useDashboard } from '../hook/useDashboard';
import { KPICard } from '../components/DashboardKPI';
import type { RecentStudent, RecentTest } from '../services/dashboardApi';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const formatDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

const skillTagColor = (skillId: number | null) => {
  switch (skillId) {
    case 3: return 'blue';    // Reading
    case 2: return 'purple';  // Listening
    case 5: return 'orange';  // Speaking
    case 4: return 'green';   // Writing
    case 1: return 'cyan';    // Grammar
    default: return 'default';
  }
};

const DashboardIndex: React.FC = () => {
  const {
    kpis,
    questionStats,
    examCounts,
    skillDistribution,
    activityData,
    recentStudents,
    recentTests,
    timelineItems,
    isSummaryLoading,
    isActivityLoading,
    isStudentsLoading,
    isTestsLoading,
    isActivitiesLoading,
  } = useDashboard();

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary, marginBottom: '1.5rem' }}>
        Tổng quan Hệ thống
      </Title>

      {/* KPI Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Tổng học viên"
            value={kpis.totalStudents.value}
            icon={<UserOutlined style={{ color: ADMIN_COLORS.primary, marginRight: '8px' }} />}
            trend={kpis.totalStudents.trend}
            trendType={kpis.totalStudents.trendType}
            trendLabel={kpis.totalStudents.trendLabel}
            loading={isSummaryLoading}
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Ngân hàng câu hỏi"
            value={kpis.totalQuestions.value}
            icon={<FileOutlined style={{ color: ADMIN_COLORS.success, marginRight: '8px' }} />}
            trend={kpis.totalQuestions.trend}
            trendType={kpis.totalQuestions.trendType}
            trendLabel={kpis.totalQuestions.trendLabel}
            loading={isSummaryLoading}
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Hoạt động hôm nay"
            value={kpis.dailyActivity.value}
            icon={<FireOutlined style={{ color: ADMIN_COLORS.warning, marginRight: '8px' }} />}
            trend={kpis.dailyActivity.trend}
            trendType={kpis.dailyActivity.trendType}
            trendLabel={kpis.dailyActivity.trendLabel}
            loading={isSummaryLoading}
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Bộ đề thi"
            value={kpis.totalExams.value}
            icon={<FileTextOutlined style={{ color: ADMIN_COLORS.info, marginRight: '8px' }} />}
            trend={kpis.totalExams.trend}
            trendType={kpis.totalExams.trendType}
            trendLabel={kpis.totalExams.trendLabel}
            loading={isSummaryLoading}
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Bài thi hoàn thành"
            value={kpis.completedTests.value}
            icon={<CheckCircleOutlined style={{ color: ADMIN_COLORS.success, marginRight: '8px' }} />}
            trend={kpis.completedTests.trend}
            trendType={kpis.completedTests.trendType}
            trendLabel={kpis.completedTests.trendLabel}
            loading={isSummaryLoading}
          />
        </Col>
      </Row>

      {/* Content Visualization Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '1rem' }}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ Ngân hàng câu hỏi" variant="borderless" loading={isSummaryLoading}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionStats.skills} layout="vertical" margin={{ left: 40, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" fill={ADMIN_COLORS.primary} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cấu trúc Bộ đề thi" variant="borderless" loading={isSummaryLoading}>
            <div style={{ height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {examCounts.types.map((type) => (
                <div key={type.type} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>{type.name}</Text>
                    <Text type="secondary">{type.count} đề</Text>
                  </div>
                  <Progress
                    percent={examCounts.total ? (type.count / examCounts.total) * 100 : 0}
                    showInfo={false}
                    strokeColor={ADMIN_COLORS.primary}
                    strokeWidth={10}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Học viên hoạt động 30 ngày qua" variant="borderless" loading={isActivityLoading}>
            <S.ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrammar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a365d" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a365d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorListening" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpeaking" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWriting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="grammar" name="Ngữ pháp" stroke="#1a365d" fillOpacity={1} fill="url(#colorGrammar)" strokeWidth={2} />
                  <Area type="monotone" dataKey="reading" name="Đọc" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorReading)" strokeWidth={2} />
                  <Area type="monotone" dataKey="listening" name="Nghe" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorListening)" strokeWidth={2} />
                  <Area type="monotone" dataKey="speaking" name="Nói" stroke="#f97316" fillOpacity={1} fill="url(#colorSpeaking)" strokeWidth={2} />
                  <Area type="monotone" dataKey="writing" name="Viết" stroke="#16a34a" fillOpacity={1} fill="url(#colorWriting)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </S.ChartWrapper>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Phân bổ kỹ năng ôn luyện" variant="borderless" loading={isSummaryLoading}>
            <S.PieChartWrapper>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {skillDistribution.map((entry) => (
                      <Cell key={`cell-${entry.skillId}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </S.PieChartWrapper>
          </Card>
        </Col>
      </Row>

      {/* Tables & Timeline Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card title="Học viên đăng ký mới" variant="borderless">
            <Table<RecentStudent>
              rowKey="id"
              loading={isStudentsLoading}
              dataSource={recentStudents}
              columns={[
                {
                  title: 'Học viên',
                  dataIndex: 'fullName',
                  key: 'fullName',
                  render: (text: string, record) => (
                    <Space>
                      <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0)}</Avatar>
                      <div>
                        <Text strong style={{ display: 'block', fontSize: '13px' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{record.email}</Text>
                      </div>
                    </Space>
                  ),
                },
                {
                  title: 'Ngày đăng ký',
                  dataIndex: 'registeredAt',
                  key: 'registeredAt',
                  render: (date: string) => <Text type="secondary" style={{ fontSize: '12px' }}>{formatDate(date)}</Text>,
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>
                      {status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                    </Tag>
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card title="Bài làm mới nhất" variant="borderless">
            <Table<RecentTest>
              rowKey="resultId"
              loading={isTestsLoading}
              dataSource={recentTests}
              columns={[
                {
                  title: 'Học viên',
                  dataIndex: 'studentName',
                  key: 'studentName',
                },
                {
                  title: 'Kỹ năng',
                  dataIndex: 'skillName',
                  key: 'skillName',
                  render: (skillName: string, record) => (
                    <Tag color={skillTagColor(record.skillId)}>{skillName}</Tag>
                  ),
                },
                {
                  title: 'Điểm số',
                  dataIndex: 'score',
                  key: 'score',
                  render: (score: number, record) => (
                    <span style={{ fontWeight: 600, color: record.status === 'GRADED' ? ADMIN_COLORS.success : ADMIN_COLORS.warning }}>
                      {record.status === 'GRADED' ? `${score}/${record.maxScore}` : 'Chờ chấm'}
                    </span>
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} xl={5}>
          <Card title="Hoạt động gần đây" variant="borderless" loading={isActivitiesLoading}>
            <Timeline items={timelineItems} />
          </Card>
        </Col>
      </Row>
    </S.Container>
  );
};

export default DashboardIndex;

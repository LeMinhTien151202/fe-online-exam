import React from 'react';
import { Col, Row, Card, Table, Timeline, Typography, Avatar, Tag, Space, Progress } from 'antd';
import {
  UserOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const DashboardIndex: React.FC = () => {
  const {
    stats,
    activityData,
    skillDistribution,
    recentStudents,
    recentTests,
    timelineEvents,
    questionStats,
    examCounts,
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
            value={stats.totalStudents}
            icon={<UserOutlined style={{ color: ADMIN_COLORS.primary, marginRight: '8px' }} />}
            trend="12%"
            trendType="up"
            trendLabel="so với hôm qua"
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Ngân hàng câu hỏi"
            value={stats.totalQuestions}
            icon={<FileOutlined style={{ color: ADMIN_COLORS.success, marginRight: '8px' }} />}
            trend="New"
            trendType="neutral"
            trendLabel="Xem chi tiết bên dưới"
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Hoạt động hôm nay"
            value={stats.dailyActivity}
            icon={<FireOutlined style={{ color: ADMIN_COLORS.warning, marginRight: '8px' }} />}
            trend="5.4%"
            trendType="up"
            trendLabel="so với hôm qua"
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Bộ đề thi"
            value={stats.totalExams}
            icon={<FileTextOutlined style={{ color: ADMIN_COLORS.info, marginRight: '8px' }} />}
            trend="Live"
            trendType="neutral"
            trendLabel="Xem chi tiết bên dưới"
          />
        </Col>

        <Col xs={24} sm={12} xl={{ flex: '1 0 18%' }}>
          <KPICard
            title="Bài thi hoàn thành"
            value={stats.completedTests}
            icon={<CheckCircleOutlined style={{ color: ADMIN_COLORS.success, marginRight: '8px' }} />}
            trend="8.2%"
            trendType="up"
            trendLabel="so với hôm qua"
          />
        </Col>
      </Row>






      {/* Content Visualization Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '1rem' }}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ Ngân hàng câu hỏi" bordered={false}>
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
          <Card title="Cấu trúc Bộ đề thi" bordered={false}>

            <div style={{ height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {examCounts.types.map((type, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>{type.name}</Text>
                    <Text type="secondary">{type.count} đề</Text>
                  </div>
                  <Progress
                    percent={(type.count / examCounts.total) * 100}
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
          <Card title="Học viên hoạt động 30 ngày qua" bordered={false}>
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
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Grammar" stroke="#1a365d" fillOpacity={1} fill="url(#colorGrammar)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Reading" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorReading)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </S.ChartWrapper>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Phân bổ kỹ năng ôn luyện" bordered={false}>
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
                  >
                    {skillDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
          <Card title="Học viên đăng ký mới" bordered={false}>
            <Table
              dataSource={recentStudents}
              columns={[
                {
                  title: 'Học viên',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text: string, record: any) => (
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
                  title: 'Gói',
                  dataIndex: 'package',
                  key: 'package',
                  render: (pkg: string) => (
                    <Tag color={pkg === 'Premium' ? 'gold' : pkg === 'Pro' ? 'blue' : 'default'}>
                      {pkg}
                    </Tag>
                  ),
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={status === 'Active' ? 'success' : 'error'}>
                      {status}
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
          <Card title="Bài làm mới nhất" bordered={false}>
            <Table
              dataSource={recentTests}
              columns={[
                {
                  title: 'Học viên',
                  dataIndex: 'student',
                  key: 'student',
                },
                {
                  title: 'Kỹ năng',
                  dataIndex: 'skill',
                  key: 'skill',
                  render: (skill: string) => (
                    <Tag color={
                      skill === 'Reading' ? 'blue' :
                        skill === 'Listening' ? 'purple' :
                          skill === 'Speaking' ? 'orange' :
                            skill === 'Writing' ? 'green' : 'cyan'
                    }>
                      {skill}
                    </Tag>
                  ),
                },
                {
                  title: 'Điểm số',
                  dataIndex: 'score',
                  key: 'score',
                  render: (score: string) => (
                    <span style={{ fontWeight: 600, color: score === 'Chờ chấm' ? ADMIN_COLORS.warning : ADMIN_COLORS.success }}>
                      {score}
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
          <Card title="Hoạt động gần đây" bordered={false}>
            <Timeline items={timelineEvents} />
          </Card>
        </Col>
      </Row>
    </S.Container>
  );
};

export default DashboardIndex;

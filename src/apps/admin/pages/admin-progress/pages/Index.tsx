import React from 'react';
import { Card, Col, Row, Select, DatePicker, Button, Table, Avatar, Typography, Space, Tag, Progress } from 'antd';
import {
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { ADMIN_COLORS } from '../../../constants';
import { useProgress } from '../hook/useProgress';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const ProgressIndex: React.FC = () => {
  const {
    filterType,
    setFilterType,
    timelineProgress,
    correctVsIncorrect,
    leaderboard,
    skillGauges,
    getGaugeData,
  } = useProgress();

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        Tiến độ học tập toàn hệ thống
      </Title>

      {/* Top Filter Bar */}
      <Card size="small" bordered={false}>
        <Space wrap>
          <Select value={filterType} onChange={setFilterType} style={{ width: 180 }}>
            <Select.Option value="all">Tất cả học viên</Select.Option>
            <Select.Option value="pro">Chỉ học viên Pro</Select.Option>
            <Select.Option value="premium">Chỉ học viên Premium</Select.Option>
          </Select>
          <DatePicker.RangePicker />
          <Button type="primary" style={{ background: ADMIN_COLORS.primary }}>Áp dụng bộ lọc</Button>
        </Space>
      </Card>

      {/* Row 1: 5 Gauge charts */}
      <Row gutter={[16, 16]}>
        {skillGauges.map(gauge => (
          <Col xs={24} sm={12} xl={4.8} key={gauge.title} style={{ flex: '1 1 20%' }}>
            <Card bordered={false} hoverable style={{ textAlign: 'center' }}>
              <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '0.5rem' }}>
                {gauge.title}
              </Text>
              <S.GaugeChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="100%"
                    barSize={10}
                    data={getGaugeData(gauge.value, gauge.color)}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar background dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <S.GaugeValueText>
                  <Title level={4} style={{ margin: 0 }}>{gauge.value}%</Title>
                </S.GaugeValueText>
              </S.GaugeChartWrapper>
              <div style={{ marginTop: '0.5rem' }}>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {gauge.students} học viên ôn tập
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Row 2 & 3: Performance Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="So sánh tiến độ trung bình theo tuần" bordered={false}>
            <S.ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineProgress} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Grammar" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="Reading" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="Listening" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </S.ChartWrapper>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Phân tích tỷ lệ Đúng / Sai theo kỹ năng" bordered={false}>
            <S.ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={correctVsIncorrect} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Correct" fill="#16a34a" stackId="a" />
                  <Bar dataKey="Incorrect" fill="#dc2626" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </S.ChartWrapper>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Leaderboard */}
      <Card title="Bảng xếp hạng thành tích học tập" bordered={false}>
        <Table
          dataSource={leaderboard}
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Hạng',
              dataIndex: 'rank',
              key: 'rank',
              render: (rank: number) => {
                const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
                return <span style={{ fontSize: '18px' }}>{medals[rank] || rank}</span>;
              },
            },
            {
              title: 'Học viên',
              dataIndex: 'name',
              key: 'name',
              render: (text: string) => (
                <Space>
                  <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0)}</Avatar>
                  <Text strong>{text}</Text>
                </Space>
              ),
            },
            {
              title: 'Tiến độ hoàn thành',
              dataIndex: 'progress',
              key: 'progress',
              render: (prog: number) => <Progress percent={prog} style={{ width: 150 }} strokeColor={ADMIN_COLORS.primary} />,
            },
            {
              title: 'Chuỗi ngày liên tiếp',
              dataIndex: 'streak',
              key: 'streak',
              render: (streak: number) => <Text strong>🔥 {streak} ngày</Text>,
            },
            {
              title: 'Điểm số TB',
              dataIndex: 'avgScore',
              key: 'avgScore',
              render: (score: string) => <Tag color="success">{score}</Tag>,
            },
            {
              title: 'Trình độ',
              dataIndex: 'level',
              key: 'level',
              render: (lvl: string) => <Tag color="cyan">{lvl}</Tag>,
            },
          ]}
        />
      </Card>
    </S.Container>
  );
};

export default ProgressIndex;

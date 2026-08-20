import React from 'react';
import { Card, Divider, Progress, Space, Spin, Tag, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { IAiCriterion, IAiGradeDetail } from '@/shared/services/student-exam';

const { Text } = Typography;

interface QuestionGradeCardProps {
  loading: boolean; // đang gọi AI chấm
  grade?: IAiGradeDetail | null; // kết quả AI của câu hiện tại
}

// Thang điểm tiêu chí theo Aptis (điểm quy đổi 0–50).
const CRITERION_MAX = 50;

// Màu theo TỈ LỆ điểm (đỏ -> vàng -> xanh); dùng chung cho điểm tổng (0–100) và tiêu chí (0–50).
const colorByFraction = (fraction: number | null): string => {
  if (fraction == null) return '#94a3b8';
  if (fraction >= 0.75) return '#10b981';
  if (fraction >= 0.5) return '#f59e0b';
  return '#ef4444';
};

// Một tiêu chí = MỘT HÀNG ngang gọn: tên | thanh điểm | điểm số theo thang 0–50.
const CriterionRow: React.FC<{ item: IAiCriterion }> = ({ item }) => {
  const color = colorByFraction(item.score == null ? null : item.score / CRITERION_MAX);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span
        style={{
          flex: '0 0 128px',
          fontWeight: 600,
          color: '#334155',
          fontSize: '0.82rem',
          lineHeight: 1.2,
        }}
      >
        {item.name}
      </span>
      <Progress
        percent={item.score == null ? 0 : Math.round((item.score / CRITERION_MAX) * 100)}
        showInfo={false}
        strokeColor={color}
        size="small"
        style={{ flex: 1, margin: 0 }}
      />
      <span
        style={{
          flex: '0 0 46px',
          textAlign: 'right',
          fontWeight: 700,
          color,
          fontSize: '0.85rem',
          whiteSpace: 'nowrap',
        }}
      >
        {item.score != null ? `${item.score}/${CRITERION_MAX}` : '--'}
      </span>
    </div>
  );
};

// Hiển thị trạng thái và kết quả AI cho câu/bộ hiện tại; hành động chấm nằm ở footer trang.
export const QuestionGradeCard: React.FC<QuestionGradeCardProps> = ({
  loading,
  grade,
}) => {
  if (!loading && !grade) return null;

  const criteria = grade?.criteria?.filter((c) => c && c.name) ?? [];

  return (
    <div>
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6366f1' }}>
          <Spin size="small" /> AI đang chấm, vui lòng đợi (khoảng 10–30 giây)...
        </div>
      )}

      {grade && !loading && (
        <Card
          size="small"
          style={{ borderRadius: 12, borderColor: '#e0e7ff', background: '#fafaff' }}
        >
          {/* Đầu thẻ: nhãn AI + band + điểm tổng */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Space>
              <RobotOutlined style={{ color: '#6366f1' }} />
              <span style={{ fontWeight: 700, color: '#1a365d' }}>AI chấm bài</span>
              {grade.band && <Tag color="green">Band {grade.band}</Tag>}
            </Space>
            <b style={{ color: colorByFraction(grade.aiScore / 100), fontSize: '1.15rem' }}>
              {Math.round((grade.aiScore / 100) * CRITERION_MAX)}
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
                /{CRITERION_MAX}
              </span>
            </b>
          </div>

          {/* Nhận xét chung */}
          {grade.feedback && (
            <Text
              style={{
                display: 'block',
                color: '#475569',
                fontSize: '0.86rem',
                whiteSpace: 'pre-wrap',
                marginTop: 4,
              }}
            >
              {grade.feedback}
            </Text>
          )}

          {/* Điểm các tiêu chí — xếp NGANG theo lưới gọn */}
          {criteria.length > 0 && (
            <>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', marginBottom: 8 }}>
                Điểm theo tiêu chí
              </div>
              {criteria.map((item, idx) => (
                <CriterionRow key={`${item.name}-${idx}`} item={item} />
              ))}
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default QuestionGradeCard;

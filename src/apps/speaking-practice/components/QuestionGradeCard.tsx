import React from 'react';
import { Button, Card, Space, Spin, Tag, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { IAiGradeDetail } from '@/shared/services/student-exam';

const { Text } = Typography;

interface QuestionGradeCardProps {
  canGrade: boolean; // đã thu âm xong chưa
  loading: boolean; // đang gọi AI chấm
  grade?: IAiGradeDetail | null; // kết quả AI của câu hiện tại
  onGrade: () => void;
}

// Dumb component: nút "Chấm câu này" + hiển thị điểm/band/nhận xét của AI cho 1 câu.
export const QuestionGradeCard: React.FC<QuestionGradeCardProps> = ({
  canGrade,
  loading,
  grade,
  onGrade,
}) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <Button
        type="primary"
        icon={<RobotOutlined />}
        onClick={onGrade}
        loading={loading}
        disabled={!canGrade || loading}
        style={{ borderRadius: '2rem', fontWeight: 600, background: '#6366f1', borderColor: '#6366f1' }}
      >
        {loading ? 'Đang chấm...' : grade ? 'Chấm lại câu này' : 'Chấm câu này'}
      </Button>

      {!canGrade && !grade && (
        <div style={{ marginTop: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
          Hãy thu âm trước khi chấm.
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#6366f1' }}>
          <Spin size="small" /> AI đang chấm, vui lòng đợi (khoảng 10–30 giây)...
        </div>
      )}

      {grade && !loading && (
        <Card
          size="small"
          style={{ marginTop: 12, borderRadius: 12, borderColor: '#e0e7ff', background: '#fafaff' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Space>
              <RobotOutlined style={{ color: '#6366f1' }} />
              <span style={{ fontWeight: 700, color: '#1a365d' }}>AI chấm bài</span>
              {grade.band && <Tag color="green">Band {grade.band}</Tag>}
            </Space>
            {grade.aiScore != null ? (
              <b style={{ color: '#10b981', fontSize: '1.05rem' }}>{grade.aiScore}/100</b>
            ) : (
              <Tag color="warning">Chờ chấm tay</Tag>
            )}
          </div>
          <Text style={{ color: '#475569', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
            {grade.feedback || 'Chưa có nhận xét.'}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default QuestionGradeCard;

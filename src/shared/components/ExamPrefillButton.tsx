import { ThunderboltOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { EXAM_PREFILL_ENABLED } from '@/shared/services/student-exam';

interface ExamPrefillButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ExamPrefillButton = ({ loading, disabled, onClick }: ExamPrefillButtonProps) => {
  if (!EXAM_PREFILL_ENABLED) return null;

  return (
    <Button
      icon={<ThunderboltOutlined />}
      size="middle"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      title="Chỉ dùng để kiểm thử ở môi trường phát triển"
      style={{
        borderRadius: '2rem',
        fontWeight: 700,
        background: '#fbbf24',
        borderColor: '#fbbf24',
        color: '#1a365d'
      }}
    >
      Điền đáp án mẫu
    </Button>
  );
};

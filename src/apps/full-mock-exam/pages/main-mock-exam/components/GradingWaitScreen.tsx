import {
  CheckCircleFilled,
  ClockCircleOutlined,
  LoadingOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import * as S from '../styles/shared.styles';

interface GradingWaitScreenProps {
  examTitle?: string;
}

const formatElapsedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const GradingWaitScreen = ({ examTitle }: GradingWaitScreenProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <S.GradingPage aria-busy="true">
      <S.GradingShell>
        <S.GradingStatusPanel>
          <S.GradingStatusLabel>Đang xử lý bài thi</S.GradingStatusLabel>
          <S.GradingIconStage aria-hidden="true">
            <S.GradingPulseRing />
            <S.GradingIconCircle>
              <RobotOutlined />
            </S.GradingIconCircle>
          </S.GradingIconStage>

          <div>
            <S.GradingPanelTitle>Bài làm đã được gửi an toàn</S.GradingPanelTitle>
            <S.GradingPanelText>{examTitle || 'Đề thi thử Aptis'}</S.GradingPanelText>
          </div>

          <S.ElapsedTime>
            <ClockCircleOutlined />
            <span>Đã chờ {formatElapsedTime(elapsedSeconds)}</span>
          </S.ElapsedTime>
        </S.GradingStatusPanel>

        <S.GradingContent>
          <S.GradingHeading>AI đang chấm bài thi của bạn</S.GradingHeading>
          <S.GradingLead>
            Phần Nói và Viết cần được phân tích kỹ trước khi hệ thống tổng hợp điểm toàn bài.
          </S.GradingLead>

          <S.GradingEstimate>
            <ClockCircleOutlined />
            <div>
              <strong>Thời gian dự kiến: 2 đến 3 phút</strong>
              <span>Kết quả sẽ tự động xuất hiện trên màn hình này khi hoàn tất.</span>
            </div>
          </S.GradingEstimate>

          <S.GradingSteps aria-label="Tiến trình chấm bài">
            <S.GradingStep $state="done">
              <S.GradingStepIcon><CheckCircleFilled /></S.GradingStepIcon>
              <div>
                <strong>Đã nhận bài làm</strong>
                <span>Hệ thống đã tiếp nhận toàn bộ câu trả lời và bản ghi âm.</span>
              </div>
            </S.GradingStep>
            <S.GradingStep $state="active">
              <S.GradingStepIcon><LoadingOutlined spin /></S.GradingStepIcon>
              <div>
                <strong>Đang chấm tự động</strong>
                <span>AI đang phân tích nội dung, phát âm và chất lượng bài viết.</span>
              </div>
            </S.GradingStep>
            <S.GradingStep $state="waiting">
              <S.GradingStepIcon>3</S.GradingStepIcon>
              <div>
                <strong>Tổng hợp kết quả</strong>
                <span>Điểm số, trình độ CEFR và nhận xét sẽ được trình bày cùng nhau.</span>
              </div>
            </S.GradingStep>
          </S.GradingSteps>

          <S.GradingSafetyNote>
            <SafetyCertificateOutlined />
            <span>Không tải lại trang hoặc bấm nộp thêm lần nữa trong khi hệ thống đang chấm.</span>
          </S.GradingSafetyNote>
        </S.GradingContent>
      </S.GradingShell>
    </S.GradingPage>
  );
};

export default GradingWaitScreen;

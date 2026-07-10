import {
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Badge, Button, Progress, Space, Tag } from 'antd';
import { ExamLoading, ExamEmpty } from '@/shared/components/ExamState';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart2Action } from '../hook/usePart2Action';
import * as S from '../styles/styled';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    data,
    slotCount,
    total,
    currentNumber,
    hasNext,
    hasPrev,
    handleNext,
    handlePrev,
    timeLeft,
    isSubmitted,
    pool,
    slots,
    dragOverSlot,
    formatTime,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,
    handleSubmit,
    handleRetry,
    placedCount,
    progressPercent,
    correctCount
  } = usePart2Action();

  const slotIds = Array.from({ length: slotCount }, (_, i) => i + 1);

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.BackLink to="/reading">
                <LeftOutlined /> Quay lại danh sách
              </S.BackLink>
              <S.HeaderTitle>
                Part 2: Text Cohesion
              </S.HeaderTitle>
              {total > 0 && (
                <Tag color="blue" style={{ fontWeight: 600 }}>Câu {currentNumber}/{total}</Tag>
              )}
              {isSubmitted && slotCount > 0 && (
                <Tag color={correctCount === slotCount ? 'success' : 'warning'} style={{ fontWeight: 600 }}>
                  Kết quả: {correctCount}/{slotCount}
                </Tag>
              )}
            </Space>

            <Space size="large" className="flex items-center">
              <Progress
                type="circle"
                percent={progressPercent}
                size={40}
                strokeColor="#10b981"
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{placedCount}/{slotCount || 0}</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          {isLoading ? (
            <ExamLoading />
          ) : !data ? (
            <div style={{ padding: '3rem' }}>
              <ExamEmpty />
            </div>
          ) : (
          <S.MainContent>
            <S.Column>
              <div className="flex items-center gap-2 mb-2">
                <Badge status="processing" text={<span className="font-bold text-[#0f172a] text-[0.95rem]">Sắp xếp các đáp án theo đúng thứ tự</span>} />
              </div>
              <S.ColumnHeader>
                Sắp xếp đoạn văn
              </S.ColumnHeader>
              <S.StoryContainer>
                {/* Fixed first sentence */}
                {data.fixedSentence && (
                  <S.FixedSentenceCard>
                    {data.fixedSentence}
                  </S.FixedSentenceCard>
                )}

                {/* Drop slots */}
                {slotIds.map((idx) => {
                  const item = slots[idx];
                  const isOver = dragOverSlot === idx;
                  const isCorrect = item && item.id === data.correctOrder[idx - 1];

                  return (
                    <div
                      key={idx}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(idx)}
                    >
                      {item ? (
                        <S.PlacedItemCard
                          draggable={!isSubmitted}
                          onDragStart={() => handleDragStart(item, idx)}
                          $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                        >
                          <span className="text">
                            <span className="text-[#94a3b8] mr-1.5">({idx})</span>
                            {item.text}
                          </span>
                          {!isSubmitted && (
                            <button
                              className="btn-remove"
                              onClick={() => handleRemoveFromSlot(idx, item)}
                            >
                              ✕
                            </button>
                          )}
                        </S.PlacedItemCard>
                      ) : (
                        <S.EmptySlotDropzone $isOver={isOver}>
                          Kéo câu vào đây cho vị trí số {idx}
                        </S.EmptySlotDropzone>
                      )}
                    </div>
                  );
                })}
              </S.StoryContainer>

              <S.AdminExperienceCard>
                <div className="info-left">
                  <div className="icon-bulb">
                    <BulbOutlined />
                  </div>
                  <div className="text-content">
                    <div className="title">Kinh nghiệm của Admin cho Part 2</div>
                    <div className="subtitle">Text Organization (Short Text)</div>
                  </div>
                </div>
                <button className="btn-show">Show</button>
              </S.AdminExperienceCard>
            </S.Column>

            <S.Column>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#0f172a] text-[0.95rem]">
                  {isSubmitted ? 'Đáp án đúng' : '← Kéo hoặc click để chọn câu'}
                </span>
                <span className="text-[0.75rem] text-[#64748b] font-semibold">
                  {isSubmitted ? 'Bảng đáp án' : `${placedCount}/${slotCount} Đã xếp`}
                </span>
              </div>
              <S.ColumnHeader className="invisible select-none">
                &nbsp;
              </S.ColumnHeader>
              <S.OptionsPool>
                {isSubmitted ? (
                  <S.OptionsWrapper>
                    {data.correctOrder.map((id, index) => {
                      const text = data.initialSentences.find(s => s.id === id)?.text;
                      return (
                        <S.CorrectAnswerRow key={id}>
                          <S.CorrectBadgeNumber>
                            {index + 1}
                          </S.CorrectBadgeNumber>
                          <S.CorrectAnswerText>{text}</S.CorrectAnswerText>
                        </S.CorrectAnswerRow>
                      );
                    })}
                  </S.OptionsWrapper>
                ) : (
                  pool.map((item) => (
                    <S.DraggableCard
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item, null)}
                      onClick={() => handleAutoPlace(item)}
                    >
                      <S.DragGripHandle>⋮⋮</S.DragGripHandle>
                      <S.DraggableText>{item.text}</S.DraggableText>
                    </S.DraggableCard>
                  ))
                )}
                {!isSubmitted && pool.length === 0 && (
                  <S.CompletedMessage>
                    ✓ Đã sắp xếp tất cả các câu!
                  </S.CompletedMessage>
                )}
              </S.OptionsPool>
            </S.Column>
          </S.MainContent>
          )}

          <S.Footer>
            <Space size="middle">
              <S.FooterButton
                type="default"
                icon={<LeftOutlined />}
                size="large"
                onClick={() => navigate({ to: '/reading' })}
              >
                Quay lại danh sách
              </S.FooterButton>
              {hasPrev && (
                <Button size="large" onClick={handlePrev}>Câu trước</Button>
              )}
            </Space>

            <Space size="middle">
              {isSubmitted ? (
                <S.RetryButton
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  onClick={handleRetry}
                >
                  Làm lại
                </S.RetryButton>
              ) : (
                <S.SubmitButton
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="large"
                  onClick={handleSubmit}
                  disabled={!data}
                >
                  Nộp bài
                </S.SubmitButton>
              )}
              {hasNext && (
                <Button type="primary" size="large" icon={<RightOutlined />} onClick={handleNext}>
                  Câu tiếp theo
                </Button>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;

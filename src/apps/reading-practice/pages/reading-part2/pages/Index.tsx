import {
BulbOutlined,
CheckCircleOutlined,
ClockCircleOutlined,
LeftOutlined,
RollbackOutlined
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Alert,Badge,Progress,Select,Space } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { usePart2Action } from '../hook/usePart2Action';
import { correctOrder,fixedSentence,initialSentences } from '../services/data';
import * as S from '../styles/styled';

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const {
    timeLeft,
    version,
    setVersion,
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
              <S.HeaderSelect 
                value={version} 
                onChange={(val) => setVersion(val as string)}
                size="small"
                dropdownMatchSelectWidth={false}
                disabled={isSubmitted}
              >
                <Select.Option value="v3">v3</Select.Option>
                <Select.Option value="v2">v2</Select.Option>
                <Select.Option value="v1">v1</Select.Option>
              </S.HeaderSelect>
            </Space>

            <Space size="large" className="flex items-center">
              <Progress 
                type="circle" 
                percent={progressPercent} 
                size={40} 
                strokeColor="#10b981" 
                trailColor="rgba(255,255,255,0.2)"
                format={() => <S.ProgressText>{placedCount}/5</S.ProgressText>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined className="text-[#fbbf24] mr-1" />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          {isSubmitted && (
            <S.AlertOuterWrapper>
              <S.AlertWrapper>
                <Alert
                  message={
                    <span className="font-semibold">
                      Kết quả sắp xếp: {correctCount}/5 vị trí đúng ({Math.round(correctCount / 5 * 100)}%)
                    </span>
                  }
                  description="Các câu đúng có viền xanh lá. Các câu sai có viền đỏ. Bạn có thể xem thứ tự đúng bên dưới."
                  type={correctCount === 5 ? "success" : "warning"}
                  showIcon
                  closable
                />
              </S.AlertWrapper>
            </S.AlertOuterWrapper>
          )}

          <S.MainContent>
            <S.Column>
              <div className="flex items-center gap-2 mb-2">
                <Badge status="processing" text={<span className="font-bold text-[#0f172a] text-[0.95rem]">Sắp xếp các đáp án theo đúng thứ tự</span>} />
              </div>
              <S.ColumnHeader>
                A new café in town (Version 3)
              </S.ColumnHeader>
              <S.StoryContainer>
                {/* Fixed first sentence */}
                <S.FixedSentenceCard>
                  {fixedSentence}
                </S.FixedSentenceCard>

                {/* Drop slots */}
                {[1, 2, 3, 4, 5].map((idx) => {
                  const item = slots[idx];
                  const isOver = dragOverSlot === idx;
                  const isCorrect = item && item.id === correctOrder[idx - 1];
                  
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
                  {isSubmitted ? 'Bảng đáp án' : `${placedCount}/5 Đã xếp`}
                </span>
              </div>
              <S.ColumnHeader className="invisible select-none">
                &nbsp;
              </S.ColumnHeader>
              <S.OptionsPool>
                {isSubmitted ? (
                  <S.OptionsWrapper>
                    {correctOrder.map((id, index) => {
                      const text = initialSentences.find(s => s.id === id)?.text;
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

          <S.Footer>
            <S.FooterButton 
              type="default" 
              icon={<LeftOutlined />} 
              size="large"
              onClick={() => navigate({ to: '/reading' })}
            >
              Quay lại danh sách
            </S.FooterButton>

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
                >
                  Nộp bài
                </S.SubmitButton>
              )}
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;

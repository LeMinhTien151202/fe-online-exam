import React from 'react';
import { Select, Button, Space, Progress, Badge, Alert } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from '../styles/styled';
import { usePart2Action } from '../hook/usePart2Action';
import { fixedSentence, initialSentences, correctOrder } from '../services/data';

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
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 2: Text Cohesion
              </span>
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

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <Progress 
                type="circle" 
                percent={progressPercent} 
                size={40} 
                strokeColor="#10b981" 
                trailColor="rgba(255,255,255,0.2)"
                format={() => <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{placedCount}/5</span>}
              />
              <S.TimerWrapper>
                <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                {formatTime(timeLeft)}
              </S.TimerWrapper>
            </Space>
          </S.Header>

          {isSubmitted && (
            <div style={{ padding: '1.5rem 2rem 0 2rem' }}>
              <Alert
                message={
                  <span style={{ fontWeight: 600 }}>
                    Kết quả sắp xếp: {correctCount}/5 vị trí đúng ({Math.round(correctCount / 5 * 100)}%)
                  </span>
                }
                description="Các câu đúng có viền xanh lá. Các câu sai có viền đỏ. Bạn có thể xem thứ tự đúng bên dưới."
                type={correctCount === 5 ? "success" : "warning"}
                showIcon
                closable
                style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
              />
            </div>
          )}

          <S.MainContent>
            <S.Column>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Badge status="processing" text={<span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Sắp xếp các đáp án theo đúng thứ tự</span>} />
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
                            <span style={{ color: '#94a3b8', marginRight: '6px' }}>({idx})</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                  {isSubmitted ? 'Đáp án đúng' : '← Kéo hoặc click để chọn câu'}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  {isSubmitted ? 'Bảng đáp án' : `${placedCount}/5 Đã xếp`}
                </span>
              </div>
              <S.ColumnHeader style={{ visibility: 'hidden', userSelect: 'none' }}>
                &nbsp;
              </S.ColumnHeader>
              <S.OptionsPool>
                {isSubmitted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {correctOrder.map((id, index) => {
                      const text = initialSentences.find(s => s.id === id)?.text;
                      return (
                        <div key={id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '0.5rem' }}>
                          <span style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {index + 1}
                          </span>
                          <span style={{ color: '#14532d', fontWeight: 600, fontSize: '0.95rem' }}>{text}</span>
                        </div>
                      );
                    })}
                  </div>
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
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px dashed #10b981', borderRadius: '0.5rem', background: '#f6fdfa', color: '#059669', fontWeight: 600 }}>
                    ✓ Đã sắp xếp tất cả các câu!
                  </div>
                )}
              </S.OptionsPool>
            </S.Column>
          </S.MainContent>

          <S.Footer>
            <Button 
              type="default" 
              icon={<LeftOutlined />} 
              size="large"
              style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
              onClick={() => navigate({ to: '/reading' })}
            >
              Quay lại danh sách
            </Button>

            <Space size="middle">
              {isSubmitted ? (
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  size="large"
                  style={{
                    borderRadius: '2rem',
                    fontWeight: 600,
                    background: '#6366f1',
                    borderColor: '#6366f1',
                    padding: '0 2rem',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                  }}
                  onClick={handleRetry}
                >
                  Làm lại
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  size="large"
                  style={{ 
                    borderRadius: '2rem', 
                    fontWeight: 600, 
                    background: '#10b981', 
                    borderColor: '#10b981',
                    padding: '0 2rem',
                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                  }}
                  onClick={handleSubmit}
                >
                  Nộp bài
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

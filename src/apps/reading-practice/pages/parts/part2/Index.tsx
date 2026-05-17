import React from 'react';
import { Select, Button, Space, Progress, Badge, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  RightOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined 
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from './styled';

interface ISentence {
  id: string;
  text: string;
}

export const Part2Page: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = React.useState(1077); // 17:57 -> 1077 giây
  const [version, setVersion] = React.useState('v3');
  
  // Các câu trắc nghiệm từ screenshot
  const initialSentences: ISentence[] = [
    { id: 's1', text: 'It was full of people, and the staff were busy on their opening day.' },
    { id: 's2', text: 'I had to choose one, so I chose the most expensive sandwich.' },
    { id: 's3', text: 'Despite the crowd, they got me a nice table and gave me the menu.' },
    { id: 's4', text: 'It tasted really good with cheese topping, and I will definitely return here.' },
    { id: 's5', text: 'When I first looked at it, I was disappointed because I hoped for a variety of dishes.' }
  ];

  const fixedSentence = 'Last night I went to the cafe opening, The Corner Cafe near my house.';

  const [pool, setPool] = React.useState<ISentence[]>(initialSentences);
  const [slots, setSlots] = React.useState<Record<number, ISentence | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  });

  const [draggedItem, setDraggedItem] = React.useState<ISentence | null>(null);
  const [draggedFromSlot, setDraggedFromSlot] = React.useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = React.useState<number | null>(null);

  // Timer countdown logic
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Drag and Drop Logic
  const handleDragStart = (item: ISentence, fromSlot: number | null = null) => {
    setDraggedItem(item);
    setDraggedFromSlot(fromSlot);
  };

  const handleDragOver = (e: React.DragEvent, slotId: number) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (slotId: number) => {
    if (!draggedItem) return;

    setSlots(prev => {
      const nextSlots = { ...prev };
      
      // Nếu thả vào slot đã có item, trả item cũ về pool
      const currentInSlot = nextSlots[slotId];
      if (currentInSlot) {
        setPool(prevPool => [...prevPool, currentInSlot]);
      }

      // Nếu kéo từ slot khác, xóa ở slot cũ
      if (draggedFromSlot !== null) {
        nextSlots[draggedFromSlot] = null;
      } else {
        // Kéo từ pool, xóa ở pool
        setPool(prevPool => prevPool.filter(item => item.id !== draggedItem.id));
      }

      nextSlots[slotId] = draggedItem;
      return nextSlots;
    });

    setDraggedItem(null);
    setDraggedFromSlot(null);
    setDragOverSlot(null);
  };

  const handleRemoveFromSlot = (slotId: number, item: ISentence) => {
    setSlots(prev => ({
      ...prev,
      [slotId]: null
    }));
    setPool(prevPool => [...prevPool, item]);
  };

  const handleAutoPlace = (item: ISentence) => {
    const firstEmptySlot = Object.keys(slots).find(key => !slots[Number(key)]);
    if (firstEmptySlot) {
      const slotNum = Number(firstEmptySlot);
      setSlots(prev => ({
        ...prev,
        [slotNum]: item
      }));
      setPool(prevPool => prevPool.filter(p => p.id !== item.id));
    } else {
      message.warning('Tất cả các ô trống đã đầy! Hãy kéo bớt item ra.');
    }
  };

  const handleSubmit = () => {
    const filledCount = Object.values(slots).filter(s => s !== null).length;
    if (filledCount < 5) {
      message.warning(`Vui lòng hoàn thành sắp xếp tất cả 5 ô trống! (Hiện tại: ${filledCount}/5)`);
      return;
    }
    message.success('Sắp xếp câu chính xác! Bài thi Part 2 đã hoàn tất.');
    navigate({ to: '/reading/part/3' });
  };

  const placedCount = Object.values(slots).filter(Boolean).length;
  const progressPercent = Math.round((placedCount / 5) * 100);

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <S.BackLink to="/reading">
                <LeftOutlined /> Quay lại
              </S.BackLink>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
                Part 2: Text Cohesion
              </span>
              <S.HeaderSelect 
                value={version} 
                onChange={(val) => setVersion(val as string)}
                size="small"
                dropdownMatchSelectWidth={false}
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
                  return (
                    <div 
                      key={idx}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(idx)}
                    >
                      {item ? (
                        <S.PlacedItemCard 
                          draggable 
                          onDragStart={() => handleDragStart(item, idx)}
                        >
                          <span className="text">{item.text}</span>
                          <button 
                            className="btn-remove" 
                            onClick={() => handleRemoveFromSlot(idx, item)}
                          >
                            ✕
                          </button>
                        </S.PlacedItemCard>
                      ) : (
                        <S.EmptySlotDropzone $isOver={isOver}>
                          Kéo câu vào đây
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
                    <div className="title">Kinh nghiệm của Admin cho Part 3</div>
                    <div className="subtitle">Text Organization (Short Text)</div>
                  </div>
                </div>
                <button className="btn-show">Show</button>
              </S.AdminExperienceCard>
            </S.Column>

            <S.Column>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>← Kéo hoặc click để chọn câu</span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{placedCount}/5 Đã xếp</span>
              </div>
              <S.ColumnHeader style={{ visibility: 'hidden', userSelect: 'none' }}>
                &nbsp;
              </S.ColumnHeader>
              <S.OptionsPool>
                {pool.map((item) => (
                  <S.DraggableCard
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item, null)}
                    onClick={() => handleAutoPlace(item)}
                  >
                    <S.DragGripHandle>⋮⋮</S.DragGripHandle>
                    <S.DraggableText>{item.text}</S.DraggableText>
                  </S.DraggableCard>
                ))}
                {pool.length === 0 && (
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
              onClick={() => navigate({ to: '/reading/part/1' })}
            >
              Trở lại Part 1
            </Button>

            <Space size="middle">
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
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  borderRadius: '2rem', 
                  fontWeight: 600, 
                  background: '#2563eb', 
                  borderColor: '#2563eb',
                  padding: '0 1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
                onClick={() => navigate({ to: '/reading/part/3' })}
              >
                Tiếp theo (Part 3) <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </Space>
          </S.Footer>
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default Part2Page;

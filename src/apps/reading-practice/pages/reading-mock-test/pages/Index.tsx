import {
AlertOutlined,
ArrowLeftOutlined,
ArrowRightOutlined,
CheckCircleOutlined,
ClockCircleOutlined,
LeftOutlined,
RollbackOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Badge, Button, Empty, Modal, Progress, Radio, Select, Space, Spin, Typography } from 'antd';
import React from 'react';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import { Part1Data, Part2Data } from '../../../services/mappers';
import { useMockTest } from '../hook/useMockTest';
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

const PART_META: Record<number, { label: string; desc: string; title: string; subtitle: string }> = {
  1: { label: 'Part 1: Điền từ', desc: 'Sentence Comprehension', title: 'Hoàn thành các câu hỏi dưới đây', subtitle: 'Chọn từ đúng từ danh sách để hoàn thành mỗi câu.' },
  2: { label: 'Part 2: Sắp xếp câu', desc: 'Text Cohesion', title: 'Sắp xếp các câu theo đúng thứ tự', subtitle: 'Kéo thả các câu vào đúng vị trí để tạo thành đoạn văn hoàn chỉnh.' },
  3: { label: 'Part 3: Sắp xếp câu', desc: 'Text Cohesion', title: 'Sắp xếp các câu theo đúng thứ tự', subtitle: 'Kéo thả các câu vào đúng vị trí để tạo thành đoạn văn hoàn chỉnh.' },
  4: { label: 'Part 4: Ghép ý kiến', desc: 'Opinion Matching', title: 'Đọc ý kiến phát biểu và chọn người phù hợp', subtitle: 'Đọc quan điểm của những người phát biểu và ghép với các nhận định.' },
  5: { label: 'Part 5: Gán tiêu đề', desc: 'Heading Match', title: 'Gán tiêu đề cho từng đoạn văn', subtitle: 'Đọc văn bản dài và chọn tiêu đề đúng cho từng đoạn văn.' },
};

export const ReadingMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    examTitle,

    part1Data,
    orderingP2,
    orderingP3,
    speakerP4,
    headingP5,

    correctP1,
    correctP2,
    correctP3,
    correctP4,
    correctP5,

    p1Answers,
    setP1Answers,
    p2Slots,
    p2Pool,
    p3Slots,
    p3Pool,
    p4Answers,
    setP4Answers,
    p5Answers,
    setP5Answers,

    dragOverSlot,
    dragPart,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,

    activePart,
    availableParts,
    isFirstPart,
    isLastPart,
    firstQNumForPart,
    setActiveQuestionNum,
    handlePrevQuestion,
    handleNextQuestion,

    timeLeft,
    formatTime,

    isSubmitted,
    showReport,
    setShowReport,
    handleManualSubmit,
    handleRetry,

    p1QuestionCount,
    p2QuestionCount,
    p3QuestionCount,
    p4QuestionCount,
    p5QuestionCount,
    totalQuestions,
    p1AnsweredCount,
    p2AnsweredCount,
    p3AnsweredCount,
    p4AnsweredCount,
    p5AnsweredCount,
    totalAnsweredCount,

    calculateScores,
    getAptisLevel,
  } = useMockTest(testId);

  // ==================== LOADING / ERROR ====================
  if (isLoading) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/reading' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Quay lại</Button>
                <S.HeaderTitle>Đang tải đề thi...</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" tip="Đang tải đề thi từ hệ thống..." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  if (isError || totalQuestions === 0) {
    return (
      <HomeS.MainLayout>
        <Sidebar />
        <HomeS.RightColumn>
          <S.PageContainer>
            <S.Header>
              <Space size="large">
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate({ to: '/reading' })} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Quay lại</Button>
                <S.HeaderTitle>Không có dữ liệu đề thi</S.HeaderTitle>
              </Space>
            </S.Header>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty description="Đề thi chưa có câu hỏi hoặc chưa được công khai." />
            </div>
          </S.PageContainer>
        </HomeS.RightColumn>
      </HomeS.MainLayout>
    );
  }

  // ==================== HANDLERS ====================
  const handleBackToLanding = () => {
    if (isSubmitted) { navigate({ to: '/reading' }); return; }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      icon: <AlertOutlined style={{ color: '#faad14' }} />,
      content: 'Tiến độ làm bài của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => navigate({ to: '/reading' }),
    });
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - totalAnsweredCount;
    Modal.confirm({
      title: 'Xác nhận nộp bài thi?',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      content: unansweredCount > 0
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : `Bạn đã hoàn thành toàn bộ ${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài thi để chấm điểm không?`,
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit,
    });
  };

  // ==================== PART 1: đoạn văn với ô chọn inline ====================
  const renderGapSelect = (gapId: number, options: string[]) => {
    const status: 'success' | 'error' | 'default' = isSubmitted
      ? p1Answers[gapId] === correctP1[gapId] ? 'success' : 'error'
      : 'default';
    return (
      <>
        <S.InlineSentenceSelect
          placeholder="Chọn đáp án"
          onChange={(val) => setP1Answers((prev) => ({ ...prev, [gapId]: val as string }))}
          value={p1Answers[gapId]}
          dropdownMatchSelectWidth={false}
          $hasValue={!!p1Answers[gapId]}
          $status={status}
          disabled={isSubmitted}
        >
          {options.map((opt) => (
            <Select.Option key={opt} value={opt}>{opt}</Select.Option>
          ))}
        </S.InlineSentenceSelect>
        {isSubmitted && p1Answers[gapId] !== correctP1[gapId] && (
          <span style={{ color: '#10b981', marginLeft: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
            (Đáp án đúng: <strong>{correctP1[gapId]}</strong>)
          </span>
        )}
      </>
    );
  };

  const renderPassage = (pd: Part1Data) => {
    const optionsByGap = new Map(pd.questions.map((q) => [q.id, q.options]));

    // Dạng chuẩn ___(n): chèn Select đúng vị trí theo số
    if (/___\(\d+\)/.test(pd.content)) {
      const segments = pd.content.split(/___\((\d+)\)/g);
      return (
        <S.QuestionText style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
          {segments.map((seg, i) =>
            i % 2 === 1 ? (
              <React.Fragment key={`gap-${seg}`}>
                {renderGapSelect(Number(seg), optionsByGap.get(Number(seg)) ?? [])}
              </React.Fragment>
            ) : (
              <React.Fragment key={`text-${i}`}>{seg}</React.Fragment>
            )
          )}
        </S.QuestionText>
      );
    }

    // Dạng gạch chân "___" không đánh số: thay lần lượt theo thứ tự câu hỏi
    if (/_{2,}/.test(pd.content)) {
      const segments = pd.content.split(/_{2,}/g);
      let blankIdx = -1;
      return (
        <S.QuestionText style={{ whiteSpace: 'pre-line', lineHeight: 2.6 }}>
          {segments.map((seg, i) => {
            const nodes = [<React.Fragment key={`text-${i}`}>{seg}</React.Fragment>];
            if (i < segments.length - 1) {
              blankIdx += 1;
              const q = pd.questions[blankIdx];
              if (q) nodes.push(
                <React.Fragment key={`gap-${q.id}`}>{renderGapSelect(q.id, q.options)}</React.Fragment>
              );
            }
            return nodes;
          })}
        </S.QuestionText>
      );
    }

    // Không có chỗ trống: hiện đoạn văn rồi liệt kê từng câu + ô chọn
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pd.content && (
          <S.QuestionText style={{ whiteSpace: 'pre-line', lineHeight: 1.9 }}>{pd.content}</S.QuestionText>
        )}
        {pd.questions.map((q) => (
          <S.QuestionRow key={q.id}>
            <S.BadgeNumber>{q.id}</S.BadgeNumber>
            <S.QuestionText style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {renderGapSelect(q.id, q.options)}
            </S.QuestionText>
          </S.QuestionRow>
        ))}
      </div>
    );
  };

  const renderPart1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {part1Data.map((pd, idx) => (
        <div key={idx}>{renderPassage(pd)}</div>
      ))}
    </div>
  );

  // ==================== PART 2 & 3: ordering (kéo thả) ====================
  const renderOrdering = (
    part: number,
    data: Part2Data | null,
    slots: Record<number, Part2Data['initialSentences'][number] | null>,
    pool: Part2Data['initialSentences'],
    correctOrder: string[],
    count: number
  ) => {
    if (!data) return <Empty description="Không có dữ liệu sắp xếp cho phần này." />;

    return (
      <S.TwoColumnLayout>
        <S.Part2Column>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
            Khung văn bản hoàn chỉnh
          </div>
          <S.StoryContainer>
            {data.fixedSentence && <S.FixedSentenceCard>{data.fixedSentence}</S.FixedSentenceCard>}
            {Array.from({ length: count }, (_, i) => i + 1).map((idx) => {
              const item = slots[idx];
              const isCorrect = isSubmitted && item ? item.id === correctOrder[idx - 1] : false;
              const status: 'success' | 'error' | 'default' = isSubmitted ? (isCorrect ? 'success' : 'error') : 'default';
              const isOver = dragPart === part && dragOverSlot === idx;
              return (
                <div key={idx} onDragOver={(e) => handleDragOver(e, idx)} onDragLeave={handleDragLeave} onDrop={() => handleDrop(part, idx)}>
                  {item ? (
                    <S.PlacedItemCard $status={status} draggable={!isSubmitted} onDragStart={() => handleDragStart(part, item, idx)}>
                      <span className="text">
                        <span style={{ color: '#94a3b8', marginRight: '6px', fontWeight: 'bold' }}>({idx})</span>
                        {item.text}
                      </span>
                      {!isSubmitted && (
                        <button className="btn-remove" onClick={(e) => { e.stopPropagation(); handleRemoveFromSlot(part, idx, item); }}>✕</button>
                      )}
                    </S.PlacedItemCard>
                  ) : (
                    <S.EmptySlotDropzone $isOver={isOver}>Kéo thả câu vào vị trí số ({idx})</S.EmptySlotDropzone>
                  )}
                </div>
              );
            })}
          </S.StoryContainer>
        </S.Part2Column>

        <S.Part2Column>
          {isSubmitted ? (
            <>
              <div style={{ fontWeight: 700, color: '#14532d', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Đáp án chính xác theo thứ tự</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {correctOrder.map((id, index) => {
                  const text = data.initialSentences.find((s) => s.id === id)?.text;
                  return (
                    <div key={id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '0.5rem' }}>
                      <span style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>{index + 1}</span>
                      <span style={{ color: '#14532d', fontWeight: 600, fontSize: '0.9rem' }}>{text}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Kho câu (click hoặc kéo vào ô)</div>
              <S.OptionsPool>
                {pool.map((item) => (
                  <S.DraggableCard key={item.id} draggable onDragStart={() => handleDragStart(part, item, null)} onClick={() => handleAutoPlace(part, item)}>
                    <S.DragGripHandle>⋮⋮</S.DragGripHandle>
                    <S.DraggableText>{item.text}</S.DraggableText>
                  </S.DraggableCard>
                ))}
                {pool.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px dashed #10b981', borderRadius: '0.5rem', background: '#f6fdfa', color: '#059669', fontWeight: 600 }}>✓ Đã xếp đủ tất cả câu!</div>
                )}
              </S.OptionsPool>
            </>
          )}
        </S.Part2Column>
      </S.TwoColumnLayout>
    );
  };

  // ==================== PART 4: speaker match ====================
  const renderPart4 = () => {
    if (!speakerP4) return <Empty description="Không có dữ liệu ghép ý kiến cho phần này." />;
    const { opinions, questions } = speakerP4;
    return (
      <S.TwoColumnLayout style={{ gridTemplateColumns: '4.5fr 5.5fr', gap: '1.5rem' }}>
        <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Quan điểm của {opinions.length} người phát biểu</div>
          {opinions.map((person) => (
            <S.PersonCard key={person.id} style={{ marginBottom: '0.75rem' }}>
              <S.PersonHeader>
                <S.PersonAvatar $color={person.color}>{person.id}</S.PersonAvatar>
                <Text strong style={{ fontSize: '1rem', color: '#1e293b' }}>{person.name}</Text>
              </S.PersonHeader>
              <Paragraph style={{ margin: 0, fontSize: '0.925rem', lineHeight: 1.6, color: '#475569' }}>{person.text}</Paragraph>
            </S.PersonCard>
          ))}
        </S.Part2Column>

        <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Chọn người phát biểu tương ứng cho các nhận định</div>
          {questions.map((q, idx) => {
            const answer = p4Answers[q.id];
            const correctAns = correctP4[q.id];
            const isCorrect = answer === correctAns;
            return (
              <S.StatementCard key={q.id} $isAnswered={!!answer} $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Badge count={idx + 1} style={{ backgroundColor: isSubmitted ? (isCorrect ? '#10b981' : '#ef4444') : (answer ? '#2563eb' : '#94a3b8'), color: 'white', fontWeight: 'bold' }} />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '0.5rem', lineHeight: 1.4 }}>{q.text}</Text>
                    <S.StyledRadioGroup optionType="button" buttonStyle="solid" value={answer} onChange={(e) => setP4Answers((prev) => ({ ...prev, [q.id]: e.target.value as string }))} disabled={isSubmitted} style={{ marginTop: '0.25rem' }}>
                      {opinions.map((o) => (<Radio.Button key={o.id} value={o.id}>{o.id}</Radio.Button>))}
                    </S.StyledRadioGroup>
                    {isSubmitted && !isCorrect && (
                      <div style={{ marginTop: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                        Đáp án đúng: <strong>{correctAns}</strong> ({opinions.find((o) => o.id === correctAns)?.name})
                      </div>
                    )}
                  </div>
                </div>
              </S.StatementCard>
            );
          })}
        </S.Part2Column>
      </S.TwoColumnLayout>
    );
  };

  // ==================== PART 5: heading match ====================
  const renderPart5 = () => {
    if (!headingP5) return <Empty description="Không có dữ liệu gán tiêu đề cho phần này." />;
    const { headings, paragraphs } = headingP5;
    return (
      <S.TwoColumnLayout style={{ gridTemplateColumns: '5.5fr 4.5fr', gap: '1.5rem' }}>
        <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Bài viết ({paragraphs.length} đoạn văn)</div>
          {paragraphs.map((p) => (
            <S.ParagraphWrapper key={p.num}>
              <S.ParagraphNumber>{p.num}</S.ParagraphNumber>
              <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: '#334155' }}>{p.text}</Paragraph>
            </S.ParagraphWrapper>
          ))}
        </S.Part2Column>

        <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Gán tiêu đề cho từng đoạn văn</div>
          {paragraphs.map((p) => {
            const answer = p5Answers[p.num];
            const correctAns = correctP5[p.num];
            const isCorrect = answer === correctAns;
            return (
              <S.QuestionSlot key={p.num} $isAnswered={!!answer} $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Text strong style={{ color: '#334155', fontSize: '0.95rem' }}>Đoạn văn {p.num}:</Text>
                  <Select placeholder="Chọn tiêu đề phù hợp..." style={{ width: '100%' }} value={answer} onChange={(val) => setP5Answers((prev) => ({ ...prev, [p.num]: val as string }))} size="large" allowClear disabled={isSubmitted}>
                    {headings.map((h) => (<Select.Option key={h.value} value={h.value}>{h.label}</Select.Option>))}
                  </Select>
                  {isSubmitted && !isCorrect && (
                    <div style={{ marginTop: '0.25rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>Đáp án đúng: {headings.find((h) => h.value === correctAns)?.label}</div>
                  )}
                </div>
              </S.QuestionSlot>
            );
          })}
        </S.Part2Column>
      </S.TwoColumnLayout>
    );
  };

  const renderActivePart = () => {
    switch (activePart) {
      case 1: return renderPart1();
      case 2: return renderOrdering(2, orderingP2, p2Slots, p2Pool, correctP2, p2QuestionCount);
      case 3: return renderOrdering(3, orderingP3, p3Slots, p3Pool, correctP3, p3QuestionCount);
      case 4: return renderPart4();
      case 5: return renderPart5();
      default: return null;
    }
  };

  // ==================== NAV PANEL ====================
  const partProgress = (n: number) => {
    switch (n) {
      case 1: return { answered: p1AnsweredCount, total: p1QuestionCount };
      case 2: return { answered: p2AnsweredCount, total: p2QuestionCount };
      case 3: return { answered: p3AnsweredCount, total: p3QuestionCount };
      case 4: return { answered: p4AnsweredCount, total: p4QuestionCount };
      case 5: return { answered: p5AnsweredCount, total: p5QuestionCount };
      default: return { answered: 0, total: 0 };
    }
  };

  const scores = calculateScores();
  const partScore = (n: number): number => {
    if (!isSubmitted) return -1;
    return [scores.scoreP1, scores.scoreP2, scores.scoreP3, scores.scoreP4, scores.scoreP5][n - 1] ?? 0;
  };

  const renderQuestionNav = () => (
    <S.NavPanel>
      <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
      {availableParts.map((num) => {
        const { answered, total } = partProgress(num);
        const score = partScore(num);
        const isActive = activePart === num;
        const meta = PART_META[num];
        return (
          <div key={num} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', border: isActive ? '1px solid #bfdbfe' : '1px solid transparent', background: isActive ? '#eff6ff' : 'transparent', marginBottom: '0.5rem' }} onClick={() => setActiveQuestionNum(firstQNumForPart(num))}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 700, color: isActive ? '#244b80' : '#334155', fontSize: '0.95rem' }}>{meta.label}</span>
              <span style={{ fontSize: '0.875rem', color: isSubmitted ? (score > 0 ? '#10b981' : '#ef4444') : '#64748b' }}>{isSubmitted ? `${score}/${total}` : `${answered}/${total}`}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{meta.desc}</div>
            <Progress percent={total > 0 ? Math.round((answered / total) * 100) : 0} size="small" strokeColor={isSubmitted ? (score === total ? '#10b981' : score > 0 ? '#f59e0b' : '#ef4444') : '#3b82f6'} trailColor="#f1f5f9" showInfo={false} style={{ marginTop: '0.375rem' }} />
          </div>
        );
      })}
      <S.Legend>
        {!isSubmitted ? (
          <>
            <S.LegendItem><div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} /><span>Chưa trả lời</span></S.LegendItem>
            <S.LegendItem><div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} /><span>Đã trả lời</span></S.LegendItem>
            <S.LegendItem><div className="color-dot" style={{ background: 'white', border: '1.5px solid #1a365d' }} /><span>Đang chọn</span></S.LegendItem>
          </>
        ) : (
          <>
            <S.LegendItem><div className="color-dot" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }} /><span>Trả lời đúng</span></S.LegendItem>
            <S.LegendItem><div className="color-dot" style={{ background: '#fef2f2', border: '1px solid #fecaca' }} /><span>Trả lời sai</span></S.LegendItem>
          </>
        )}
      </S.Legend>
    </S.NavPanel>
  );

  const meta = PART_META[activePart];
  const { totalScore } = scores;
  const partPosition = availableParts.indexOf(activePart) + 1;

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <Button type="text" icon={<LeftOutlined />} onClick={handleBackToLanding} style={{ color: '#cbd5e1', fontWeight: 'bold' }}>Quay lại</Button>
              <S.HeaderTitle>{examTitle}</S.HeaderTitle>
            </Space>
            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button type="primary" onClick={() => setShowReport(true)} style={{ background: '#1a365d', borderColor: '#1a365d', borderRadius: '2rem', fontWeight: 700 }}>Xem báo cáo điểm</Button>
                  <Button type="primary" icon={<RollbackOutlined />} onClick={handleRetry} style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}>Thi lại đề này</Button>
                </Space>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>TIẾN ĐỘ:</span>
                    <Progress type="circle" percent={Math.round((totalAnsweredCount / totalQuestions) * 100)} size={40} strokeColor="#10b981" trailColor="rgba(255,255,255,0.2)" format={() => (<span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{totalAnsweredCount}/{totalQuestions}</span>)} />
                  </div>
                  <S.TimerWrapper><ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />{formatTime(timeLeft)}</S.TimerWrapper>
                </>
              )}
            </Space>
          </S.Header>

          {isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#1a365d', margin: 0 }}>Kết quả thi thử</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>Bạn đã hoàn thành {examTitle}</Text>
                </Space>
                <S.ScoreRingWrapper>
                  <Progress type="circle" percent={Math.round((totalScore / totalQuestions) * 100)} size={140} strokeWidth={10} strokeColor="#10b981" format={() => (<S.ScoreLabel><span className="score-val">{totalScore}</span><span className="score-max">/ {totalQuestions} câu</span></S.ScoreLabel>)} />
                </S.ScoreRingWrapper>
                <S.ReportGrid>
                  <S.ReportStatItem><span className="stat-label">Cấp độ Đọc</span><span className="stat-value">{getAptisLevel(totalScore)}</span></S.ReportStatItem>
                  <S.ReportStatItem><span className="stat-label">Tỷ lệ đúng</span><span className="stat-value">{Math.round((totalScore / totalQuestions) * 100)}%</span></S.ReportStatItem>
                  <S.ReportStatItem><span className="stat-label">Đã trả lời</span><span className="stat-value">{totalAnsweredCount} / {totalQuestions} câu</span></S.ReportStatItem>
                  <S.ReportStatItem><span className="stat-label">Số câu đúng</span><span className="stat-value">{totalScore} câu</span></S.ReportStatItem>
                </S.ReportGrid>
                <Button type="primary" size="large" style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#1a365d', borderColor: '#1a365d' }} onClick={() => setShowReport(false)}>Xem lại đáp án chi tiết</Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody>
                <S.WorkspaceGrid>
                  <S.QuestionsColumn>
                    <S.ContentCard>
                      <S.TitleArea>
                        <h2>{meta.title}</h2>
                        <div className="subtitle">{meta.subtitle}</div>
                      </S.TitleArea>
                      {renderActivePart()}
                    </S.ContentCard>
                  </S.QuestionsColumn>
                  {renderQuestionNav()}
                </S.WorkspaceGrid>
              </S.ContentBody>

              <S.Footer>
                <Button type="default" icon={<ArrowLeftOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }} onClick={handlePrevQuestion} disabled={isFirstPart}>Phần trước</Button>
                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>Phần {partPosition} trên {availableParts.length} (Đã làm {totalAnsweredCount} / {totalQuestions})</span>
                <Space size="middle">
                  {!isSubmitted && (
                    <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#10b981', borderColor: '#10b981', padding: '0 2rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }} onClick={handleSubmitClick}>Nộp bài</Button>
                  )}
                  {isSubmitted && (
                    <Button type="default" icon={<RollbackOutlined />} size="large" style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }} onClick={() => navigate({ to: '/reading' })}>Thoát xem lại</Button>
                  )}
                  <Button type="primary" size="large" style={{ borderRadius: '2rem', fontWeight: 600, background: '#2563eb', borderColor: '#2563eb', padding: '0 1.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }} onClick={handleNextQuestion} disabled={isLastPart}>Phần tiếp theo <ArrowRightOutlined style={{ fontSize: '12px' }} /></Button>
                </Space>
              </S.Footer>
            </>
          )}
        </S.PageContainer>
      </HomeS.RightColumn>
    </HomeS.MainLayout>
  );
};

export default ReadingMockTestPage;

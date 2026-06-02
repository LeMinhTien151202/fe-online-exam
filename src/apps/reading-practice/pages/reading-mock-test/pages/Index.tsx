import React from 'react';
import { Button, Space, Progress, Badge, Select, Radio, Alert, Modal, Typography, Tooltip } from 'antd';
import { useNavigate, useParams } from '@tanstack/react-router';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  AlertOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Sidebar } from '../../../../home/components/Sidebar';
import * as HomeS from '../../../../home/pages/styled';
import * as S from '../styles/styled';
import { useMockTest } from '../hook/useMockTest';
import {
  p1QuestionsData,
  p2FixedSentence,
  initialP2Sentences,
  p3Opinions,
  p3Questions,
  p4Paragraphs,
  p4Headings,
  correctP1,
  correctP2,
  correctP3,
  correctP4
} from '../services/data';

const { Title, Text, Paragraph } = Typography;

export const ReadingMockTestPage: React.FC = () => {
  const { testId } = useParams({ strict: false }) as { testId: string };
  const navigate = useNavigate();

  const {
    p1Answers,
    setP1Answers,
    p2Slots,
    p3Answers,
    setP3Answers,
    p4Answers,
    setP4Answers,
    p2Pool,
    activeQuestionNum,
    setActiveQuestionNum,
    activePart,
    timeLeft,
    isSubmitted,
    showReport,
    setShowReport,
    dragOverSlot,
    formatTime,
    p1AnsweredCount,
    p2AnsweredCount,
    p3AnsweredCount,
    p4AnsweredCount,
    totalAnsweredCount,
    calculateScores,
    getAptisLevel,
    handleManualSubmit,
    handleRetry,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromSlot,
    handleAutoPlace,
    handleNavigateQuestion,
    handlePrevQuestion,
    handleNextQuestion
  } = useMockTest(testId);

  const testTitle = testId === 'm2' ? 'Đề Đọc hiểu số 2' : testId === 'm3' ? 'Đề Đọc hiểu số 3' : 'Đề Đọc hiểu số 1';
  const totalQuestions = 24;

  const handleBackToLanding = () => {
    if (isSubmitted) {
      navigate({ to: '/reading' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận thoát khỏi đề thi?',
      icon: <AlertOutlined style={{ color: '#faad14' }} />,
      content: 'Tiến độ làm bài của bạn sẽ không được lưu nếu bạn thoát ra lúc này.',
      okText: 'Thoát ra',
      cancelText: 'Làm tiếp',
      onOk: () => {
        navigate({ to: '/reading' });
      }
    });
  };

  const handleSubmitClick = () => {
    const unansweredCount = totalQuestions - totalAnsweredCount;
    const hasUnanswered = unansweredCount > 0;

    Modal.confirm({
      title: 'Xác nhận nộp bài thi?',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      content: hasUnanswered
        ? `Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có thực sự muốn nộp bài thi ngay bây giờ không?`
        : 'Bạn đã hoàn thành toàn bộ 24 câu hỏi. Bạn có chắc chắn muốn nộp bài thi để chấm điểm không?',
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      onOk: handleManualSubmit
    });
  };

  const renderActiveQuestionContent = () => {
    // PART 1 (Questions 1 - 5)
    if (activeQuestionNum <= 5) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {p1QuestionsData.map((q) => {
            const answer = p1Answers[q.id];
            const correctAns = correctP1[q.id];
            const isCorrect = answer === correctAns;
            let selectStatus: 'success' | 'error' | 'default' = 'default';
            if (isSubmitted) {
              selectStatus = isCorrect ? 'success' : 'error';
            }
            const parts = q.sentence.split('_______');

            return (
              <S.QuestionRow key={q.id}>
                <S.BadgeNumber>{q.id}</S.BadgeNumber>
                <S.QuestionText>
                  {parts[0]}
                  <S.InlineSentenceSelect
                    placeholder="Select option"
                    onChange={(val) => setP1Answers(prev => ({ ...prev, [q.id]: val as string }))}
                    value={answer}
                    dropdownMatchSelectWidth={false}
                    $hasValue={!!answer}
                    $status={selectStatus}
                    disabled={isSubmitted}
                  >
                    {q.options.map(opt => (
                      <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                    ))}
                  </S.InlineSentenceSelect>
                  {parts[1]}
                  {isSubmitted && !isCorrect && (
                    <span style={{ color: '#10b981', marginLeft: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                      (Đáp án đúng: <strong>{correctAns}</strong>)
                    </span>
                  )}
                </S.QuestionText>
              </S.QuestionRow>
            );
          })}

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích đáp án Part 1:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <li><strong>Câu 1:</strong> 'effective' có nghĩa là 'có hiệu lực'. Câu hoàn chỉnh: Các chính sách mới sẽ có hiệu lực bắt đầu từ học kỳ tới.</li>
                <li><strong>Câu 2:</strong> 'maximum' có nghĩa là 'tối đa'. Câu hoàn chỉnh: Sinh viên hiện có thể mượn tối đa mười cuốn sách cùng một lúc.</li>
                <li><strong>Câu 3:</strong> 'extended' có nghĩa là 'được gia hạn'. Câu hoàn chỉnh: Thời gian mượn sách đã được gia hạn thành ba tuần.</li>
                <li><strong>Câu 4:</strong> 'fine' có nghĩa là 'tiền phạt'. Câu hoàn chỉnh: Sẽ có một khoản tăng nhẹ trong tiền phạt đối với việc trả sách muộn.</li>
                <li><strong>Câu 5:</strong> 'renew' có nghĩa là 'gia hạn'. Câu hoàn chỉnh: Sinh viên được khuyến khích gia hạn các mục của họ trực tuyến.</li>
              </ul>
            </div>
          )}
        </div>
      );
    }

    // PART 2 (Questions 6 - 10)
    if (activeQuestionNum >= 6 && activeQuestionNum <= 10) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <S.TwoColumnLayout>
            <S.Part2Column>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Khung văn bản hoàn chỉnh (Chọn ô để làm câu đó)
              </div>
              <S.StoryContainer>
                <S.FixedSentenceCard>{p2FixedSentence}</S.FixedSentenceCard>

                {[1, 2, 3, 4, 5].map((idx) => {
                  const item = p2Slots[idx];
                  let isCorrect = false;
                  let status: 'success' | 'error' | 'default' = 'default';
                  if (isSubmitted) {
                    isCorrect = item ? item.id === correctP2[idx - 1] : false;
                    status = isCorrect ? 'success' : 'error';
                  }

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
                          $status={status}
                          draggable={!isSubmitted}
                          onDragStart={() => handleDragStart(item, idx)}
                        >
                          <span className="text">
                            <span style={{ color: '#94a3b8', marginRight: '6px', fontWeight: 'bold' }}>({idx})</span>
                            {item.text}
                          </span>
                          {!isSubmitted && (
                            <button className="btn-remove" onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot(idx, item);
                            }}>✕</button>
                          )}
                        </S.PlacedItemCard>
                      ) : (
                        <S.EmptySlotDropzone $isOver={isOver}>
                          Kéo thả câu vào vị trí số ({idx})
                        </S.EmptySlotDropzone>
                      )}
                    </div>
                  );
                })}
              </S.StoryContainer>
            </S.Part2Column>

            <S.Part2Column>
              {isSubmitted ? (
                <>
                  <div style={{ fontWeight: 700, color: '#14532d', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    Đáp án chính xác theo thứ tự
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {correctP2.map((id, index) => {
                      const text = initialP2Sentences.find(s => s.id === id)?.text;
                      return (
                        <div key={id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '0.5rem' }}>
                          <span style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                            {index + 1}
                          </span>
                          <span style={{ color: '#14532d', fontWeight: 600, fontSize: '0.9rem' }}>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    Kho câu hỏi lựa chọn (Click hoặc kéo vào ô đang chọn)
                  </div>
                  <S.OptionsPool>
                    {p2Pool.map((item) => (
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
                    {p2Pool.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px dashed #10b981', borderRadius: '0.5rem', background: '#f6fdfa', color: '#059669', fontWeight: 600 }}>
                        ✓ Đã xếp đủ cả 5 câu!
                      </div>
                    )}
                  </S.OptionsPool>
                </>
              )}
            </S.Part2Column>
          </S.TwoColumnLayout>

          {isSubmitted && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <CheckCircleOutlined /> <span>Giải thích thứ tự liên kết đoạn văn:</span>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Đoạn văn mở đầu nói về việc đi đến quán cà phê mới mở "The Corner Cafe".<br />
                - <strong>Vị trí (1)</strong>: <em>"It was full of people, and the staff were busy on their opening day."</em><br />
                - <strong>Vị trí (2)</strong>: <em>"Despite the crowd, they got me a nice table and gave me the menu."</em><br />
                - <strong>Vị trí (3)</strong>: <em>"When I first looked at it, I was disappointed because I hoped for a variety of dishes."</em> ("looked at it" = menu)<br />
                - <strong>Vị trí (4)</strong>: <em>"I had to choose one, so I chose the most expensive sandwich."</em><br />
                - <strong>Vị trí (5)</strong>: <em>"It tasted really good with cheese topping, and I will definitely return here."</em>
              </p>
            </div>
          )}
        </div>
      );
    }

    // PART 3 (Questions 11 - 17)
    if (activeQuestionNum >= 11 && activeQuestionNum <= 17) {
      const p3Explanations: Record<number, string> = {
        1: "Emilia (B) đề cập mua sắm nên là hoạt động xã hội với bạn bè: 'Shopping should be a social activity with friends.'",
        2: "Boyd (A) đề cập sự tiện lợi và so sánh giá tức thì: 'incredibly convenient... lets you compare prices instantly'",
        3: "Liam (C) bày tỏ lo ngại về việc thông tin cá nhân lưu trữ trên máy chủ: 'personal information is stored on servers. Hackers can steal...'",
        4: "Sofia (D) khuyên nên xem sản phẩm ở cửa hàng thực tế trước rồi mua trực tuyến để có giá rẻ hơn: 'browse products in physical retail showrooms... then buy them online at a lower price.'",
        5: "Emilia (B) lo lắng về tác động môi trường của bao bì đóng gói: 'creates too much plastic packaging waste.'",
        6: "Liam (C) không thích việc chờ đợi gói hàng được giao đến nhà: 'wait times for delivery can be highly frustrating.'",
        7: "Boyd (A) nhận thấy sản phẩm đôi khi khác với mô tả trực tuyến: 'lack of tactile feel means sometimes products do not match the photos online.'"
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <S.TwoColumnLayout style={{ gridTemplateColumns: '4.5fr 5.5fr', gap: '1.5rem' }}>
            <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Quan điểm của 4 người phát biểu (Tài liệu tham khảo)
              </div>
              {p3Opinions.map(person => (
                <S.PersonCard key={person.id} style={{ marginBottom: '0.75rem' }}>
                  <S.PersonHeader>
                    <S.PersonAvatar $color={person.color}>{person.id}</S.PersonAvatar>
                    <Text strong style={{ fontSize: '1rem', color: '#1e293b' }}>{person.name}</Text>
                  </S.PersonHeader>
                  <Paragraph style={{ margin: 0, fontSize: '0.925rem', lineHeight: 1.6, color: '#475569' }}>
                    {person.text}
                  </Paragraph>
                </S.PersonCard>
              ))}
            </S.Part2Column>

            <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Chọn người phát biểu tương ứng cho các phát biểu dưới đây
              </div>
              {p3Questions.map((q, idx) => {
                const qNum = idx + 11;
                const answer = p3Answers[idx + 1];
                const correctAns = correctP3[idx + 1];
                const isCorrect = answer === correctAns;

                return (
                  <S.StatementCard
                    key={q.id}
                    $isAnswered={!!answer}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Badge count={qNum} style={{ backgroundColor: isSubmitted ? (isCorrect ? '#10b981' : '#ef4444') : (answer ? '#2563eb' : '#94a3b8'), color: 'white', fontWeight: 'bold' }} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '1rem', color: '#1e293b', display: 'block', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                          {q.text}
                        </Text>

                        <S.StyledRadioGroup 
                          optionType="button" 
                          buttonStyle="solid"
                          value={answer}
                          onChange={(e) => setP3Answers(prev => ({ ...prev, [idx + 1]: e.target.value as string }))}
                          disabled={isSubmitted}
                          style={{ marginTop: '0.25rem' }}
                        >
                          <Radio.Button value="A">A</Radio.Button>
                          <Radio.Button value="B">B</Radio.Button>
                          <Radio.Button value="C">C</Radio.Button>
                          <Radio.Button value="D">D</Radio.Button>
                        </S.StyledRadioGroup>

                        {isSubmitted && !isCorrect && (
                          <div style={{ marginTop: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                            Đáp án đúng: <strong>{correctAns}</strong> ({p3Opinions.find(o => o.id === correctAns)?.name})
                          </div>
                        )}
                      </div>
                    </div>
                  </S.StatementCard>
                );
              })}

              {isSubmitted && (
                <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                    <CheckCircleOutlined /> <span>Giải thích đáp án Part 3:</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                    {Object.entries(p3Explanations).map(([k, text]) => (
                      <li key={k}><strong>Câu {Number(k) + 10}:</strong> {text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </S.Part2Column>
          </S.TwoColumnLayout>
        </div>
      );
    }

    // PART 4 (Questions 18 - 24)
    if (activeQuestionNum >= 18 && activeQuestionNum <= 24) {
      const p4Explanations: Record<number, string> = {
        1: "Đoạn văn 1 nói về sự phát triển vượt bậc của tự động hóa công nghiệp và ảnh hưởng toàn cầu, tương ứng tiêu đề I: 'The rise of industrial automation and its impact'.",
        2: "Đoạn văn 2 nói về nguồn gốc lịch sử của tự động hóa từ Cách mạng Công nghiệp, tương ứng tiêu đề III: 'Historical roots of manufacturing processes'.",
        3: "Đoạn văn 3 nêu bật động lực hiệu quả kinh tế và cắt giảm chi phí vận hành, tương ứng tiêu đề II: 'Economic benefits and cost efficiency'.",
        4: "Đoạn văn 4 tập trung vào cải thiện an toàn lao động bằng cách thay thế con người ở các vị trí nguy hiểm, tương ứng tiêu đề VII: 'Safety improvements in hazardous work settings'.",
        5: "Đoạn văn 5 nói về thách thức sa thải công nhân và nhu cầu đào tạo lại nghề, tương ứng tiêu đề IV: 'Challenges in worker displacement and job retraining'.",
        6: "Đoạn văn 6 thảo luận về thuật toán học máy và thị giác máy tính giúp robot đưa ra quyết định, tương ứng tiêu đề VI: 'Software algorithms and computer vision evolution'.",
        7: "Đoạn văn 7 đưa ra các dự báo tương lai về Cobots và AI tổng hợp, tương ứng tiêu đề V: 'Predictions for the next technological revolution'."
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <S.TwoColumnLayout style={{ gridTemplateColumns: '5.5fr 4.5fr', gap: '1.5rem' }}>
            <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Bài viết học thuật (7 đoạn văn)
              </div>
              {p4Paragraphs.map(p => (
                <S.ParagraphWrapper key={p.num}>
                  <S.ParagraphNumber>{p.num}</S.ParagraphNumber>
                  <Paragraph style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: '#334155' }}>
                    {p.text}
                  </Paragraph>
                </S.ParagraphWrapper>
              ))}
            </S.Part2Column>

            <S.Part2Column style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Gán tiêu đề cho từng đoạn văn
              </div>

              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const qNum = num + 17;
                const answer = p4Answers[num];
                const correctAns = correctP4[num];
                const isCorrect = answer === correctAns;

                return (
                  <S.QuestionSlot
                    key={num}
                    $isAnswered={!!answer}
                    $status={isSubmitted ? (isCorrect ? 'success' : 'error') : 'default'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Text strong style={{ color: '#334155', fontSize: '0.95rem' }}>
                        Đoạn văn {num}:
                      </Text>
                      <Select
                        placeholder="Chọn tiêu đề phù hợp từ Heading Bank..."
                        style={{ width: '100%' }}
                        value={answer}
                        onChange={(val) => setP4Answers(prev => ({ ...prev, [num]: val as string }))}
                        size="large"
                        allowClear
                        disabled={isSubmitted}
                      >
                        {p4Headings.map(h => (
                          <Select.Option key={h.value} value={h.value}>
                            {h.label}
                          </Select.Option>
                        ))}
                      </Select>

                      {isSubmitted && !isCorrect && (
                        <div style={{ marginTop: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>
                          Đáp án đúng: {p4Headings.find(h => h.value === correctAns)?.label}
                        </div>
                      )}
                    </div>
                  </S.QuestionSlot>
                );
              })}

              {isSubmitted && (
                <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                    <CheckCircleOutlined /> <span>Giải thích đáp án Part 4:</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.8 }}>
                    {Object.entries(p4Explanations).map(([k, text]) => (
                      <li key={k}><strong>Đoạn {k}:</strong> {text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </S.Part2Column>
          </S.TwoColumnLayout>
        </div>
      );
    }

    return null;
  };

  const renderQuestionNav = () => {
    const getStatus = (qNum: number): 'unanswered' | 'answered' => {
      if (qNum <= 5) return p1Answers[qNum] ? 'answered' : 'unanswered';
      if (qNum <= 10) return p2Slots[qNum - 5] ? 'answered' : 'unanswered';
      if (qNum <= 17) return p3Answers[qNum - 10] ? 'answered' : 'unanswered';
      return p4Answers[qNum - 17] ? 'answered' : 'unanswered';
    };

    const getCorrectness = (qNum: number): 'success' | 'error' | 'default' => {
      if (!isSubmitted) return 'default';
      if (qNum <= 5) {
        return p1Answers[qNum] === correctP1[qNum] ? 'success' : 'error';
      }
      if (qNum <= 10) {
        const item = p2Slots[qNum - 5];
        return item && item.id === correctP2[qNum - 6] ? 'success' : 'error';
      }
      if (qNum <= 17) {
        return p3Answers[qNum - 10] === correctP3[qNum - 10] ? 'success' : 'error';
      }
      return p4Answers[qNum - 17] === correctP4[qNum - 17] ? 'success' : 'error';
    };

    const renderGridButtons = (qNums: number[]) => {
      return (
        <S.ButtonGrid>
          {qNums.map((n) => {
            const status = getStatus(n);
            const isCorrect = getCorrectness(n);
            const isActive = activeQuestionNum === n;

            let placement: 'top' | 'topRight' | 'topLeft' = 'top';
            if (n % 5 === 1) {
              placement = 'topRight';
            } else if (n % 5 === 0) {
              placement = 'topLeft';
            }

            return (
              <Tooltip
                key={n}
                title={`Câu ${n}: ${
                  isSubmitted
                    ? isCorrect === 'success'
                      ? 'Trả lời đúng'
                      : 'Trả lời sai'
                    : status === 'answered'
                    ? 'Đã trả lời'
                    : 'Chưa trả lời'
                }`}
                placement={placement}
                mouseEnterDelay={0.15}
              >
                <S.NavGridButton
                  $active={isActive}
                  $status={status}
                  $isCorrect={isCorrect}
                  onClick={() => handleNavigateQuestion(n)}
                >
                  {n}
                </S.NavGridButton>
              </Tooltip>
            );
          })}
        </S.ButtonGrid>
      );
    };

    return (
      <S.NavPanel>
        <S.PanelTitle>Bảng câu hỏi</S.PanelTitle>
        
        <S.SectionLabel>Part 1: Điền từ (1 - 5)</S.SectionLabel>
        {renderGridButtons([1, 2, 3, 4, 5])}

        <S.SectionLabel>Part 2: Sắp xếp câu (6 - 10)</S.SectionLabel>
        {renderGridButtons([6, 7, 8, 9, 10])}

        <S.SectionLabel>Part 3: Ghép ý kiến (11 - 17)</S.SectionLabel>
        {renderGridButtons([11, 12, 13, 14, 15, 16, 17])}

        <S.SectionLabel>Part 4: Gán tiêu đề (18 - 24)</S.SectionLabel>
        {renderGridButtons([18, 19, 20, 21, 22, 23, 24])}

        <S.Legend>
          {!isSubmitted ? (
            <>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }} />
                <span>Chưa trả lời</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }} />
                <span>Đã trả lời</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: 'white', border: '1.5px solid #00205B' }} />
                <span>Đang chọn</span>
              </S.LegendItem>
            </>
          ) : (
            <>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }} />
                <span>Trả lời đúng</span>
              </S.LegendItem>
              <S.LegendItem>
                <div className="color-dot" style={{ background: '#fef2f2', border: '1px solid #fecaca' }} />
                <span>Trả lời sai</span>
              </S.LegendItem>
            </>
          )}
        </S.Legend>
      </S.NavPanel>
    );
  };

  const getPartTitleAndInstruction = () => {
    switch (activePart) {
      case 1:
        return {
          title: 'Hoàn thành các câu hỏi dưới đây',
          subtitle: 'Select the correct word from the dropdown to complete each sentence.'
        };
      case 2:
        return {
          title: 'Sắp xếp các đáp án theo đúng thứ tự',
          subtitle: 'Rearrange the sentences into the correct order to complete the text.'
        };
      case 3:
        return {
          title: 'Đọc ý kiến phát biểu và chọn người phù hợp',
          subtitle: 'Read the opinions of the four people and match them to the statements.'
        };
      case 4:
      default:
        return {
          title: 'Gán tiêu đề cho từng đoạn văn',
          subtitle: 'Read the long text and match the correct headings to the paragraphs.'
        };
    }
  };

  const { title: partTitle, subtitle: partSubtitle } = getPartTitleAndInstruction();
  const { scoreP1, scoreP2, scoreP3, scoreP4, totalScore } = calculateScores();

  return (
    <HomeS.MainLayout>
      <Sidebar />
      <HomeS.RightColumn>
        <S.PageContainer>
          <S.Header>
            <Space size="large">
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handleBackToLanding}
                style={{ color: '#cbd5e1', fontWeight: 'bold' }}
              >
                Quay lại
              </Button>
              <S.HeaderTitle>{testTitle}</S.HeaderTitle>
            </Space>

            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              {isSubmitted ? (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setShowReport(true)}
                    style={{ background: '#00205B', borderColor: '#00205B', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Xem báo cáo điểm
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<RollbackOutlined />}
                    onClick={handleRetry}
                    style={{ background: '#6366f1', borderColor: '#6366f1', borderRadius: '2rem', fontWeight: 700 }}
                  >
                    Thi lại đề này
                  </Button>
                </Space>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>TIẾN ĐỘ:</span>
                    <Progress
                      type="circle"
                      percent={Math.round(totalAnsweredCount / totalQuestions * 100)}
                      size={40}
                      strokeColor="#10b981"
                      trailColor="rgba(255,255,255,0.2)"
                      format={() => (
                        <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                          {totalAnsweredCount}/{totalQuestions}
                        </span>
                      )}
                    />
                  </div>

                  <S.TimerWrapper>
                    <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                    {formatTime(timeLeft)}
                  </S.TimerWrapper>
                </>
              )}
            </Space>
          </S.Header>

          {isSubmitted && showReport ? (
            <S.ReportContainer>
              <S.ReportCard>
                <Space direction="vertical" size="small" style={{ marginBottom: '1.5rem' }}>
                  <Title level={2} style={{ color: '#00205B', margin: 0 }}>Kết quả thi thử</Title>
                  <Text type="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                    Bạn đã hoàn thành {testTitle} trong kỹ năng Đọc hiểu
                  </Text>
                </Space>

                <S.ScoreRingWrapper>
                  <Progress 
                    type="circle" 
                    percent={Math.round(totalScore / totalQuestions * 100)} 
                    size={140}
                    strokeWidth={10}
                    strokeColor="#10b981"
                    format={() => (
                      <S.ScoreLabel>
                        <span className="score-val">{totalScore}</span>
                        <span className="score-max">/ {totalQuestions} câu</span>
                      </S.ScoreLabel>
                    )}
                  />
                </S.ScoreRingWrapper>

                <S.ReportGrid>
                  <S.ReportStatItem>
                    <span className="stat-label">Cấp độ Đọc</span>
                    <span className="stat-value">{getAptisLevel(totalScore)}</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Tỷ lệ đúng</span>
                    <span className="stat-value">{Math.round(totalScore / totalQuestions * 100)}%</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 1 & 2</span>
                    <span className="stat-value">{scoreP1 + scoreP2} / 10 câu</span>
                  </S.ReportStatItem>
                  <S.ReportStatItem>
                    <span className="stat-label">Part 3 & 4</span>
                    <span className="stat-value">{scoreP3 + scoreP4} / 14 câu</span>
                  </S.ReportStatItem>
                </S.ReportGrid>

                <div style={{ width: '100%', textAlign: 'left', background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px', color: '#00205B', fontWeight: 700 }}>
                    <AlertOutlined /> <span>Nhận xét chi tiết từ hệ thống:</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {totalScore >= 21 
                      ? "Tuyệt vời! Kỹ năng đọc hiểu của bạn ở mức C (Cao cấp). Bạn có khả năng đọc hiểu trôi chảy tất cả các loại văn bản học thuật và thực tế phức tạp. Hãy duy trì phong độ này!" 
                      : totalScore >= 15 
                      ? "Rất tốt! Kỹ năng đọc của bạn đạt trình độ B2. Bạn có thể hiểu rõ ý chính và các chi tiết tương đối sâu trong văn bản. Ôn luyện thêm các cấu trúc từ vựng nâng cao ở Part 4 để bứt phá lên mức C."
                      : totalScore >= 8 
                      ? "Kỹ năng đọc của bạn ở mức B1. Bạn có thể hiểu các đoạn văn bản cơ bản đến trung bình, tuy nhiên còn gặp khó khăn với cấu trúc câu phức tạp và từ vựng chuyên ngành. Hãy luyện tập thêm."
                      : "Kỹ năng đọc của bạn đang ở mức A1/A2. Bạn cần củng cố thêm lượng từ vựng căn bản và luyện tập thường xuyên hơn các bài đọc ngắn để nâng cao khả năng nắm bắt thông tin cơ bản."}
                  </p>
                </div>

                <Button 
                  type="primary" 
                  size="large"
                  style={{ borderRadius: '2rem', height: '48px', padding: '0 2.5rem', fontWeight: 700, background: '#00205B', borderColor: '#00205B' }}
                  onClick={() => setShowReport(false)}
                >
                  Xem lại đáp án chi tiết & Giải thích
                </Button>
              </S.ReportCard>
            </S.ReportContainer>
          ) : (
            <>
              <S.ContentBody>
                <S.WorkspaceGrid>
                  {/* Cột trái: Vùng làm bài theo Part */}
                  <S.QuestionsColumn>
                    <S.ContentCard>
                      <S.TitleArea>
                        <h2>{partTitle}</h2>
                        <div className="subtitle">{partSubtitle}</div>
                        {activePart === 1 && (
                          <S.TipBox style={{ marginTop: '8px' }}>
                            💡 Tip: Double-click vào từ tiếng Anh bất kỳ để tra nghĩa
                          </S.TipBox>
                        )}
                      </S.TitleArea>
                      {renderActiveQuestionContent()}
                    </S.ContentCard>
                  </S.QuestionsColumn>

                  {/* Cột phải: Bảng câu hỏi */}
                  {renderQuestionNav()}
                </S.WorkspaceGrid>
              </S.ContentBody>

              <S.Footer>
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b' }}
                  onClick={handlePrevQuestion}
                  disabled={activePart === 1}
                >
                  Phần trước
                </Button>

                <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.95rem' }}>
                  Phần {activePart} trên 4 (Câu {activeQuestionNum} / 24)
                </span>

                <Space size="middle">
                  {!isSubmitted && (
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
                      onClick={handleSubmitClick}
                    >
                      Nộp bài
                    </Button>
                  )}
                  {isSubmitted && (
                    <Button
                      type="default"
                      icon={<RollbackOutlined />}
                      size="large"
                      style={{ borderRadius: '2rem', fontWeight: 600, padding: '0 1.5rem', border: '1px solid #cbd5e1' }}
                      onClick={() => navigate({ to: '/reading' })}
                    >
                      Thoát xem lại
                    </Button>
                  )}
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
                    onClick={handleNextQuestion}
                    disabled={activePart === 4}
                  >
                    Phần tiếp theo <ArrowRightOutlined style={{ fontSize: '12px' }} />
                  </Button>
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

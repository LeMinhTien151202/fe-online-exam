import React from 'react';
import { Card, Button, Typography, Space, Tag, Row, Col, Progress } from 'antd';
import { ArrowLeftOutlined, SoundOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useDetailGrading } from '../hook/useDetailGrading';
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

const DetailGrading: React.FC = () => {
  const {
    navigate,
    taskAchievement,
    coherence,
    lexical,
    grammar,
    totalScore,
    isSpeaking,
  } = useDetailGrading();

  return (
    <S.Container>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/admin/grading' })} />
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết bài làm & Điểm số tự động
          </Title>
        </Space>
      </div>

      {/* Metadata info */}
      <Card size="small" bordered={false} style={{ marginBottom: '1rem' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Text type="secondary">Học viên: </Text>
            <Text strong>Nguyễn Văn A</Text>
          </Col>
          <Col span={6}>
            <Text type="secondary">Kỹ năng: </Text>
            <Tag color={isSpeaking ? 'orange' : 'green'}>{isSpeaking ? 'Speaking' : 'Writing'}</Tag>
          </Col>
          <Col span={6}>
            <Text type="secondary">Thời gian làm bài: </Text>
            <Text strong>11 phút 15 giây</Text>
          </Col>
          <Col span={6}>
            <Text type="secondary">Ngày nộp bài: </Text>
            <Text strong>03/06/2026</Text>
          </Col>
        </Row>
      </Card>

      {/* Content panel splitting */}
      <Row gutter={16}>
        {/* Left: Question + Submission */}
        <Col xs={24} lg={12}>
          <Card title="Nội dung bài làm của học viên" bordered={false}>
            {isSpeaking ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '0.25rem' }}>Đề bài Speaking Part 1:</Text>
                  <Text strong style={{ fontSize: '15px' }}>"Please tell me about your family."</Text>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fafafa' }}>
                  <Text strong style={{ display: 'block', marginBottom: '0.75rem' }}>Bài nói của học viên (Audio ghi âm):</Text>
                  {/* Mock Audio Player */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#e2e8f0', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <Button type="primary" shape="circle" icon={<SoundOutlined />} style={{ background: ADMIN_COLORS.primary }} />
                    <div style={{ flex: 1, height: '4px', background: '#cbd5e1', borderRadius: '2px', position: 'relative' }}>
                      <div style={{ width: '40%', height: '100%', background: ADMIN_COLORS.primary, borderRadius: '2px' }} />
                    </div>
                    <Text type="secondary">0:12 / 0:30</Text>
                  </div>
                </div>

                <div>
                  <Text type="secondary">Gợi ý nội dung trả lời tốt:</Text>
                  <Paragraph style={{ fontStyle: 'italic', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: `3px solid ${ADMIN_COLORS.primary}` }}>
                    Học viên cần giới thiệu số lượng thành viên, mối quan hệ và một vài thông tin mô tả cơ bản như nghề nghiệp hoặc sở thích của cha mẹ/anh chị em. Sử dụng các trạng từ liên kết câu như: "Besides", "Moreover", "Currently".
                  </Paragraph>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '0.25rem' }}>Đề bài Writing Part 2 (Note/Tin nhắn ngắn):</Text>
                  <Text strong style={{ fontSize: '15px' }}>
                    "You joined a local travel club recently. Write a short message to your friend telling them about it." (20-30 words)
                  </Text>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', minHeight: '120px' }}>
                  <Paragraph style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    "Hi Mike, I have just joined a local travel club. It is very fantastic and we are going to climb mountains next Saturday. You should join us!"
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0', paddingTop: '0.5rem' }}>
                    <Tag color="success">Độ dài: 28 từ (Hợp lệ)</Tag>
                  </div>
                </div>

                <div>
                  <Text type="secondary">Yêu cầu chấm điểm:</Text>
                  <Paragraph style={{ fontStyle: 'italic', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: `3px solid ${ADMIN_COLORS.primary}` }}>
                    Học viên phải viết được thông điệp hoàn chỉnh từ 20 đến 30 từ, nêu bật được tên câu lạc bộ du lịch mới gia nhập và rủ bạn thân tham gia cùng.
                  </Paragraph>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* Right: Auto-grading details */}
        <Col xs={24} lg={12}>
          <Card title="Kết quả đánh giá tiêu chí tự động" bordered={false} extra={<Title level={3} style={{ margin: 0, color: ADMIN_COLORS.success }}>{totalScore}/100</Title>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Text strong>1. Task Achievement (Hoàn thành nhiệm vụ)</Text>
                  <Text strong>{taskAchievement}/25</Text>
                </div>
                <Progress percent={(taskAchievement / 25) * 100} showInfo={false} strokeColor={ADMIN_COLORS.success} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Text strong>2. Coherence & Cohesion (Mạch lạc & Liên kết)</Text>
                  <Text strong>{coherence}/25</Text>
                </div>
                <Progress percent={(coherence / 25) * 100} showInfo={false} strokeColor={ADMIN_COLORS.success} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Text strong>3. Lexical Resource (Từ vựng phong phú)</Text>
                  <Text strong>{lexical}/25</Text>
                </div>
                <Progress percent={(lexical / 25) * 100} showInfo={false} strokeColor={ADMIN_COLORS.success} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Text strong>4. Grammatical Accuracy (Ngữ pháp chính xác)</Text>
                  <Text strong>{grammar}/25</Text>
                </div>
                <Progress percent={(grammar / 25) * 100} showInfo={false} strokeColor={ADMIN_COLORS.success} />
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>Đánh giá & Nhận xét của hệ thống AI:</Text>
                <Paragraph style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', color: '#166534', margin: 0 }}>
                  {isSpeaking ? (
                    "Học viên trả lời lưu loát, phát âm tương đối rõ ràng. Từ vựng cơ bản đạt yêu cầu nhưng cần tăng cường sử dụng các từ nối phức tạp hơn để liên kết ý tốt hơn. Cấu trúc câu đơn giản nhưng chính xác."
                  ) : (
                    "Đoạn văn viết đủ số từ quy định, trả lời đúng trọng tâm câu hỏi. Sử dụng từ vựng phù hợp chủ đề du lịch và lời mời. Không phát hiện lỗi ngữ pháp hay chính tả nghiêm trọng."
                  )}
                </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </S.Container>
  );
};

export default DetailGrading;

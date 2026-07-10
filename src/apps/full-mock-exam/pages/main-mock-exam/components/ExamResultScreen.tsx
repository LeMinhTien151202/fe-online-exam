import { CheckCircleFilled, RobotOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Card, Progress, Space, Tag, Typography } from 'antd';
import React from 'react';
import { IExamSubmitResult } from '../../../../../shared/services/student-exam';
import * as S from '../styles/shared.styles';

const { Text, Paragraph } = Typography;

interface ExamResultScreenProps {
    result: IExamSubmitResult;
    onBack: () => void;
}

const scoreColor = (score: number) => (score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444');

// Màn kết quả sau khi nộp MOCK_TEST: điểm tổng + phần trắc nghiệm + chi tiết AI chấm.
const ExamResultScreen: React.FC<ExamResultScreenProps> = ({ result, onBack }) => {
    const hasAi = result.ai.length > 0;

    return (
        <S.FullPageCenter>
            <div style={{ maxWidth: 720, width: '100%', padding: '1rem' }}>
                <Card style={{ borderRadius: 16, textAlign: 'center', marginBottom: '1.5rem' }}>
                    <CheckCircleFilled style={{ fontSize: 48, color: '#10b981' }} />
                    <h2 style={{ margin: '1rem 0 0.25rem', fontWeight: 800 }}>Đã nộp bài thi thử!</h2>
                    <Text type="secondary">Kết quả chấm tự động và AI đã sẵn sàng.</Text>

                    <div style={{ margin: '1.75rem 0' }}>
                        <Progress
                            type="dashboard"
                            percent={Math.round(result.score)}
                            format={(p) => <span style={{ fontWeight: 800 }}>{p}<small style={{ fontSize: 14 }}>/100</small></span>}
                            strokeColor={scoreColor(result.score)}
                        />
                        <div style={{ marginTop: '0.75rem' }}>
                            <Space size="large">
                                <span><Text type="secondary">Trắc nghiệm: </Text><b>{Math.round(result.autoScore)}</b></span>
                                <span><Text type="secondary">Điểm ý: </Text><b>{result.earnedAutoPoints}/{result.totalAutoPoints}</b></span>
                            </Space>
                        </div>
                    </div>

                    {result.needsManualReviewCount > 0 && (
                        <Tag icon={<WarningFilled />} color="warning" style={{ padding: '0.35rem 0.75rem', borderRadius: 8 }}>
                            {result.needsManualReviewCount} câu chờ chấm tay (AI chưa chấm được)
                        </Tag>
                    )}
                </Card>

                {hasAi && (
                    <Card
                        title={<Space><RobotOutlined style={{ color: '#6366f1' }} /> AI chấm bài Viết & Nói</Space>}
                        style={{ borderRadius: 16, marginBottom: '1.5rem' }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {result.ai.map((item) => (
                                <div key={item.questionId} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <Space>
                                            <Tag color={item.questionType === 'ESSAY' ? 'purple' : 'geekblue'}>{item.questionType}</Tag>
                                            {item.band && <Tag color="green">Band {item.band}</Tag>}
                                        </Space>
                                        {item.aiScore != null ? (
                                            <b style={{ color: scoreColor(item.aiScore) }}>{item.aiScore}/100</b>
                                        ) : (
                                            <Tag color="warning">Chờ chấm tay</Tag>
                                        )}
                                    </div>
                                    <Paragraph style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
                                        {item.feedback || 'Chưa có nhận xét.'}
                                    </Paragraph>
                                </div>
                            ))}
                        </Space>
                    </Card>
                )}

                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" size="large" onClick={onBack} style={{ borderRadius: 24, padding: '0 2.5rem', fontWeight: 700 }}>
                        Về danh sách đề thi
                    </Button>
                </div>
            </div>
        </S.FullPageCenter>
    );
};

export default ExamResultScreen;

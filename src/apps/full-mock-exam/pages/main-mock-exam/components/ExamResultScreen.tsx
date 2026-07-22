import { CheckOutlined, ClockCircleOutlined, RobotOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { IExamSubmitResult } from '../../../../../shared/services/student-exam';
import { cefrTagColor } from '../../../../../shared/utils/cefrScale';
import { resolveSkillScores } from '../../../services/mockExamScore';
import * as R from '../styles/result.styles';

interface ExamResultScreenProps {
    result: IExamSubmitResult;
    onBack: () => void;
}

// Màu theo điểm 0–100 cho thanh/điểm số.
const scoreHex = (score: number) => (score >= 75 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#ef4444');

// Màn kết quả sau khi nộp MOCK_TEST: CEFR tổng + điểm/band từng kỹ năng + chi tiết AI chấm.
const ExamResultScreen: React.FC<ExamResultScreenProps> = ({ result, onBack }) => {
    const hasAi = result.ai.length > 0;
    const { skills, overallCefr } = useMemo(() => resolveSkillScores(result), [result]);
    const pendingCount = result.needsManualReviewCount;

    return (
        <R.ResultPage>
            <R.ResultInner>
                {/* HERO: CEFR tổng + điểm tổng */}
                <R.HeroCard>
                    <R.HeroCheck>
                        <CheckOutlined />
                    </R.HeroCheck>
                    <R.HeroTitle>Đã nộp bài thi thử!</R.HeroTitle>
                    <R.HeroSubtitle>Kết quả chấm tự động và AI đã sẵn sàng.</R.HeroSubtitle>

                    <R.CefrLabel>Trình độ CEFR tổng</R.CefrLabel>
                    {overallCefr ? (
                        <R.CefrBadge $band={overallCefr}>
                            <span className="band">{overallCefr}</span>
                            <span className="caption">CEFR</span>
                        </R.CefrBadge>
                    ) : (
                        <R.CefrPending>
                            <ClockCircleOutlined />
                            Chưa xếp loại{pendingCount > 0 ? ' — còn câu chờ chấm tay' : ''}
                        </R.CefrPending>
                    )}

                    <R.ScoreStrip>
                        <R.ScorePill>
                            <span className="val">{Math.round(result.score)}<small>/100</small></span>
                            <span className="lbl">Điểm tổng</span>
                        </R.ScorePill>
                        <R.ScorePill>
                            <span className="val">{Math.round(result.autoScore)}</span>
                            <span className="lbl">Trắc nghiệm</span>
                        </R.ScorePill>
                        <R.ScorePill>
                            <span className="val">{result.earnedAutoPoints}/{result.totalAutoPoints}</span>
                            <span className="lbl">Điểm ý</span>
                        </R.ScorePill>
                    </R.ScoreStrip>

                    {pendingCount > 0 && (
                        <div>
                            <R.ManualReviewNote>
                                <WarningFilled />
                                {pendingCount} câu chờ chấm tay (AI chưa chấm được)
                            </R.ManualReviewNote>
                        </div>
                    )}
                </R.HeroCard>

                {/* Điểm & CEFR theo từng kỹ năng */}
                {skills.length > 0 && (
                    <R.Panel>
                        <R.PanelHead>
                            <h3>Điểm theo kỹ năng</h3>
                            <Tooltip title="Điểm 0–50 là ước lượng tuyến tính từ % làm đúng, không phải điểm scaled chính thức của Aptis.">
                                <span className="hint">(ước lượng)</span>
                            </Tooltip>
                        </R.PanelHead>

                        {skills.map((sk) => {
                            const isCore = sk.skillId === 1;
                            const pct = Math.round((sk.scaled / 50) * 100);
                            const fillColor = isCore ? '#94a3b8' : scoreHex((sk.scaled / 50) * 100);
                            return (
                                <R.SkillRow key={sk.skillId}>
                                    <R.SkillTop>
                                        <R.SkillName>
                                            <span className="name">{sk.name}</span>
                                            {isCore ? (
                                                <Tag color="default">Core · không xếp band</Tag>
                                            ) : sk.cefr ? (
                                                <Tag color={cefrTagColor(sk.cefr)} style={{ fontWeight: 700 }}>{sk.cefr}</Tag>
                                            ) : (
                                                <Tag color="warning">Chờ chấm tay</Tag>
                                            )}
                                        </R.SkillName>
                                        <R.SkillScore>{sk.scaled}<small>/50</small></R.SkillScore>
                                    </R.SkillTop>
                                    <R.BandTrack>
                                        <R.BandFill $pct={pct} $color={fillColor} />
                                    </R.BandTrack>
                                </R.SkillRow>
                            );
                        })}
                    </R.Panel>
                )}

                {/* Nhận xét AI cho Viết & Nói */}
                {hasAi && (
                    <R.Panel>
                        <R.PanelHead>
                            <RobotOutlined style={{ color: '#6366f1', fontSize: 18 }} />
                            <h3>AI chấm bài Viết & Nói</h3>
                        </R.PanelHead>

                        {result.ai.map((item) => (
                            <R.AiRow key={item.questionId}>
                                <R.AiTop>
                                    <span>
                                        <Tag color={item.questionType === 'ESSAY' ? 'purple' : 'geekblue'}>{item.questionType}</Tag>
                                        {item.band && <Tag color="green">Band {item.band}</Tag>}
                                    </span>
                                    {item.aiScore != null ? (
                                        <R.AiScoreVal $color={scoreHex(item.aiScore)}>{item.aiScore}/100</R.AiScoreVal>
                                    ) : (
                                        <Tag color="warning">Chờ chấm tay</Tag>
                                    )}
                                </R.AiTop>
                                <R.AiFeedback>{item.feedback || 'Chưa có nhận xét.'}</R.AiFeedback>
                            </R.AiRow>
                        ))}
                    </R.Panel>
                )}

                <R.Footer>
                    <Button type="primary" size="large" onClick={onBack} style={{ borderRadius: 24, padding: '0 2.5rem', fontWeight: 700, height: 46 }}>
                        Về danh sách đề thi
                    </Button>
                </R.Footer>
            </R.ResultInner>
        </R.ResultPage>
    );
};

export default ExamResultScreen;

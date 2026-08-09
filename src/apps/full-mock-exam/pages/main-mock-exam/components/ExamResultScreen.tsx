import { AudioOutlined, CheckOutlined, ClockCircleOutlined, EditOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { IAiGradeDetail, IExamSubmitResult } from '../../../../../shared/services/student-exam';
import { cefrTagColor, mockTotalScaled } from '../../../../../shared/utils/cefrScale';
import { resolveSkillScores } from '../../../services/mockExamScore';
import * as R from '../styles/result.styles';

interface ExamResultScreenProps {
    result: IExamSubmitResult;
    onBack: () => void;
}

// Màu theo điểm 0–100 cho thanh/điểm số.
const scoreHex = (score: number) => (score >= 75 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#ef4444');

// AI trả điểm 0–100/câu; quy về thang 0–50 cho đồng bộ với điểm kỹ năng Aptis.
const toScaled50 = (score: number) => Math.round(score / 2);

// Tên phần theo kỹ năng để nêu rõ câu/phần trong nhận xét AI.
const WRITING_PART_TITLE: Record<number, string> = {
    1: 'Viết câu ngắn',
    2: 'Đoạn văn ngắn',
    3: 'Trả lời nhóm chat',
    4: 'Email trang trọng & thân mật',
};
const SPEAKING_PART_TITLE: Record<number, string> = {
    1: 'Thông tin cá nhân',
    2: 'Miêu tả tranh',
    3: 'So sánh tranh',
    4: 'Chủ đề trừu tượng',
};

// Màn kết quả sau khi nộp MOCK_TEST: CEFR tổng + điểm/band từng kỹ năng + chi tiết AI chấm.
const ExamResultScreen: React.FC<ExamResultScreenProps> = ({ result, onBack }) => {
    const { skills, overallCefr } = useMemo(() => resolveSkillScores(result), [result]);
    const pendingCount = result.needsManualReviewCount;
    // Điểm tổng Aptis 0–200 = tổng scaled 4 kỹ năng ngôn ngữ (Grammar là Core, không cộng).
    const totalScore = useMemo(() => mockTotalScaled(skills), [skills]);

    // Tách nhận xét AI theo kỹ năng: Viết (skill 4 / ESSAY) và Nói (skill 5 / RECORD).
    const { writingAi, speakingAi } = useMemo(() => {
        const isWriting = (it: IAiGradeDetail) => (it.skillId ?? (it.questionType === 'ESSAY' ? 4 : 5)) === 4;
        const byPart = (a: IAiGradeDetail, b: IAiGradeDetail) => (a.partNumber ?? 0) - (b.partNumber ?? 0);
        return {
            writingAi: result.ai.filter(isWriting).sort(byPart),
            speakingAi: result.ai.filter((it) => !isWriting(it)).sort(byPart),
        };
    }, [result.ai]);

    // Render 1 thẻ nhận xét AI (nêu rõ phần/câu + điểm /50 + band).
    const renderAiCard = (item: IAiGradeDetail, idx: number, partTitles: Record<number, string>) => {
        const part = item.partNumber;
        const partText = part != null
            ? `Part ${part}${partTitles[part] ? ` · ${partTitles[part]}` : ''}`
            : `Câu ${idx + 1}`;
        return (
            <R.AiCard key={item.questionId}>
                <R.AiCardHead>
                    <R.AiPartLabel>
                        <span className="part">{partText}</span>
                        <span className="tags">
                            {item.band && <Tag color="green" style={{ margin: 0 }}>Band {item.band}</Tag>}
                        </span>
                    </R.AiPartLabel>
                    {item.aiScore != null ? (
                        <R.AiScoreVal $color={scoreHex(item.aiScore)}>
                            {toScaled50(item.aiScore)}<small>/50</small>
                        </R.AiScoreVal>
                    ) : (
                        <Tag color="warning" style={{ margin: 0 }}>Chờ chấm tay</Tag>
                    )}
                </R.AiCardHead>
                <R.AiFeedback>{item.feedback || 'Chưa có nhận xét.'}</R.AiFeedback>
            </R.AiCard>
        );
    };

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
                            <span className="val">{totalScore != null ? totalScore : '--'}<small>/200</small></span>
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

                {/* Nhận xét AI phần Viết (kỹ năng 4) */}
                {writingAi.length > 0 && (
                    <R.Panel>
                        <R.PanelHead>
                            <EditOutlined style={{ color: '#6366f1', fontSize: 18 }} />
                            <h3>AI chấm phần Viết</h3>
                            <span className="hint">{writingAi.length} câu</span>
                        </R.PanelHead>
                        <R.AiGrid>
                            {writingAi.map((item, i) => renderAiCard(item, i, WRITING_PART_TITLE))}
                        </R.AiGrid>
                    </R.Panel>
                )}

                {/* Nhận xét AI phần Nói (kỹ năng 5) */}
                {speakingAi.length > 0 && (
                    <R.Panel>
                        <R.PanelHead>
                            <AudioOutlined style={{ color: '#0891b2', fontSize: 18 }} />
                            <h3>AI chấm phần Nói</h3>
                            <span className="hint">{speakingAi.length} câu</span>
                        </R.PanelHead>
                        <R.AiGrid>
                            {speakingAi.map((item, i) => renderAiCard(item, i, SPEAKING_PART_TITLE))}
                        </R.AiGrid>
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

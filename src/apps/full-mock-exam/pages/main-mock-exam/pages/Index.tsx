import {
AudioOutlined,
ClockCircleOutlined,
CustomerServiceOutlined,
EditOutlined,
LeftOutlined,
MedicineBoxOutlined,
ReadOutlined,
RightOutlined
} from '@ant-design/icons';
import { useNavigate,useParams } from '@tanstack/react-router';
import { Button,Empty,Result,Space,Spin } from 'antd';
import React,{ useEffect,useMemo,useRef,useState } from 'react';
import { confirmExamAction } from '../../../../../shared/utils/examDialogs';

// Import các module kỹ năng tích hợp
import GrammarVocabSection,{ GrammarVocabHandle } from '../components/GrammarVocabSection';
import ListeningSection,{ ListeningHandle } from '../components/ListeningSection';
import ReadingSection,{ ReadingHandle } from '../components/ReadingSection';
import SpeakingSection,{ SpeakingHandle } from '../components/SpeakingSection';
import WritingSection,{ WritingHandle } from '../components/WritingSection';
import ExamResultScreen from '../components/ExamResultScreen';

import { useMockExamDetailQuery } from '../../../services/mockExamQuery';
import { buildFullMockExam,FullMockExamData } from '../../../services/mockExamMapper';
import {
    IExamSubmitResult,
    ISubmitAnswer,
    useSubmitExamMutation,
} from '../../../../../shared/services/student-exam';
import * as S from '../styles/shared.styles';

interface SkillStep {
    id: 'speaking' | 'listening' | 'grammar' | 'reading' | 'writing';
    title: string;
    icon: React.ReactNode;
    duration: number; // phút
    totalParts: number;
    totalQuestions: number;
}

// Thứ tự thi chuẩn APTIS: Nói -> Nghe -> Ngôn ngữ -> Đọc -> Viết
const SKILL_ORDER: { id: SkillStep['id']; title: string; icon: React.ReactNode; skillId: number; defaultDuration: number }[] = [
    { id: 'speaking', title: 'Nói', icon: <AudioOutlined />, skillId: 5, defaultDuration: 12 },
    { id: 'listening', title: 'Nghe hiểu', icon: <CustomerServiceOutlined />, skillId: 2, defaultDuration: 40 },
    { id: 'grammar', title: 'Ngôn ngữ', icon: <MedicineBoxOutlined />, skillId: 1, defaultDuration: 25 },
    { id: 'reading', title: 'Đọc hiểu', icon: <ReadOutlined />, skillId: 3, defaultDuration: 35 },
    { id: 'writing', title: 'Viết', icon: <EditOutlined />, skillId: 4, defaultDuration: 50 },
];

// Đếm số câu/số phần từng kỹ năng từ dữ liệu đề thật
const countSkill = (data: FullMockExamData, id: SkillStep['id']): { questions: number; parts: number } => {
    switch (id) {
        case 'grammar': {
            const g = data.grammar.grammarQuestions.length;
            const v = data.grammar.vocabularySets.length;
            return { questions: g + v, parts: (g > 0 ? 1 : 0) + (v > 0 ? 1 : 0) };
        }
        case 'listening': {
            const q = data.listening.part1.length
                + data.listening.part2.reduce((s, x) => s + x.speakerCount, 0)
                + data.listening.part3.reduce((s, x) => s + x.statements.length, 0)
                + data.listening.part4.reduce((s, x) => s + x.subQuestions.length, 0);
            const parts = [data.listening.part1, data.listening.part2, data.listening.part3, data.listening.part4]
                .filter((p) => p.length > 0).length;
            return { questions: q, parts };
        }
        case 'reading': {
            const r = data.reading;
            const q = r.part1.reduce((s, p) => s + p.questions.length, 0)
                + (r.orderingP2?.initialSentences.length ?? 0)
                + (r.orderingP3?.initialSentences.length ?? 0)
                + (r.speakerP4?.questions.length ?? 0)
                + (r.headingP5?.paragraphs.length ?? 0);
            const parts = [r.part1.length > 0, !!r.orderingP2, !!r.orderingP3, !!r.speakerP4, !!r.headingP5]
                .filter(Boolean).length;
            return { questions: q, parts };
        }
        case 'writing': {
            const parts = new Set(data.writing.map((w) => w.partNumber)).size;
            return { questions: data.writing.length, parts };
        }
        case 'speaking': {
            const s = data.speaking;
            const q = s.part1.length
                + s.part2.reduce((t, x) => t + x.questions.length, 0)
                + s.part3.reduce((t, x) => t + x.questions.length, 0)
                + s.part4.reduce((t, x) => t + x.questions.length, 0);
            const parts = [s.part1, s.part2, s.part3, s.part4].filter((p) => p.length > 0).length;
            return { questions: q, parts };
        }
        default:
            return { questions: 0, parts: 0 };
    }
};

const MainMockExamPage: React.FC = () => {
    const { testId } = useParams({ strict: false }) as { testId: string };
    const navigate = useNavigate();
    const examId = Number(testId);

    const { data: examDetail, isLoading, isError } = useMockExamDetailQuery(Number.isFinite(examId) && examId > 0 ? examId : null);
    const examData = useMemo(() => (examDetail ? buildFullMockExam(examDetail) : null), [examDetail]);

    // Chỉ giữ những kỹ năng thực sự có câu hỏi trong đề
    const skills = useMemo<SkillStep[]>(() => {
        if (!examData) return [];
        return SKILL_ORDER
            .map((s) => {
                const { questions, parts } = countSkill(examData, s.id);
                return {
                    id: s.id,
                    title: s.title,
                    icon: s.icon,
                    duration: examData.durations[s.skillId] ?? s.defaultDuration,
                    totalParts: parts,
                    totalQuestions: questions,
                };
            })
            .filter((s) => s.totalQuestions > 0);
    }, [examData]);

    const submitMutation = useSubmitExamMutation();

    const [activeStep, setActiveStep] = useState(0);
    // null = chưa khởi tạo (đợi dữ liệu đề); sau đó là số giây còn lại
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<IExamSubmitResult | null>(null);

    const [currentStatus, setCurrentStatus] = useState({ part: 1, question: 1, answered: 0 });

    const grammarRef = useRef<GrammarVocabHandle>(null);
    const listeningRef = useRef<ListeningHandle>(null);
    const readingRef = useRef<ReadingHandle>(null);
    const writingRef = useRef<WritingHandle>(null);
    const speakingRef = useRef<SpeakingHandle>(null);

    const currentSkill = skills[activeStep];
    // Đồng hồ hiển thị: khi chưa khởi tạo dùng thời lượng kỹ năng hiện tại
    const displayTime = timeLeft ?? (currentSkill ? currentSkill.duration * 60 : 0);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const skillRefMap: Record<string, React.RefObject<{ next: () => boolean; prev: () => boolean; collect: () => ISubmitAnswer[] } | null>> = {
        grammar: grammarRef,
        listening: listeningRef,
        reading: readingRef,
        writing: writingRef,
        speaking: speakingRef,
    };

    const handleNextSection = (isAuto = false) => {
        if (!currentSkill) return;
        if (!isAuto) {
            const currentSkillRef = skillRefMap[currentSkill.id];
            if (currentSkillRef?.current) {
                const handledInternally = currentSkillRef.current.next();
                if (handledInternally) return;
            }
        }

        const proceed = () => {
            if (activeStep < skills.length - 1) {
                const nextStep = activeStep + 1;
                setActiveStep(nextStep);
                setTimeLeft(skills[nextStep].duration * 60);
                setCurrentStatus({ part: 1, question: 1, answered: 0 });
                window.scrollTo(0, 0);
            } else {
                handleSubmitFinal();
            }
        };

        if (isAuto) {
            proceed();
            return;
        }

        confirmExamAction({
            title: 'Chuyển sang phần thi tiếp theo?',
            content: `Bạn sẽ chuyển sang phần thi ${skills[activeStep + 1]?.title || 'Kết thúc'}. Bài làm của phần hiện tại sẽ được tự động lưu.`,
            okText: 'Xác nhận chuyển',
            cancelText: 'Làm tiếp',
            onOk: proceed,
        });
    };

    const handlePrevSection = () => {
        if (!currentSkill) return;
        const currentSkillRef = skillRefMap[currentSkill.id];
        if (currentSkillRef?.current) {
            const handledInternally = currentSkillRef.current.prev();
            if (handledInternally) return;
        }

        if (activeStep > 0) {
            const prevStep = activeStep - 1;
            setActiveStep(prevStep);
            setTimeLeft(skills[prevStep].duration * 60);
            setCurrentStatus({ part: 1, question: 1, answered: 0 });
            window.scrollTo(0, 0);
        }
    };

    const handleSubmitFinal = async () => {
        // Gom đáp án từ mọi kỹ năng (mỗi section tự dịch state -> shape API)
        const answers: ISubmitAnswer[] = [];
        [grammarRef, listeningRef, readingRef, writingRef, speakingRef].forEach((r) => {
            if (r.current) answers.push(...r.current.collect());
        });

        setIsSubmitting(true);
        try {
            const result = await submitMutation.mutateAsync({ examId, payload: { answers } });
            setSubmitResult(result);
            setIsFinished(true);
        } catch {
            // Interceptor đã hiện notification lỗi; cho phép người dùng thử lại.
        } finally {
            setIsSubmitting(false);
        }
    };

    // Chỉ nhận tiến độ từ kỹ năng đang hiển thị (các section ẩn vẫn mounted để giữ state).
    const activeSkillIdRef = useRef<SkillStep['id'] | undefined>(currentSkill?.id);
    useEffect(() => {
        activeSkillIdRef.current = currentSkill?.id;
    });

    // Handler tiến độ ổn định theo từng kỹ năng (tránh tạo mới mỗi render -> loop effect ở section).
    const progressHandlers = useMemo(() => {
        const make = (id: SkillStep['id']) => (answered: number, part: number, question: number) => {
            if (activeSkillIdRef.current === id) setCurrentStatus({ part, question, answered });
        };
        return {
            grammar: make('grammar'),
            listening: make('listening'),
            reading: make('reading'),
            writing: make('writing'),
            speaking: make('speaking'),
        } as Record<SkillStep['id'], (answered: number, part: number, question: number) => void>;
    }, []);

    // Đồng hồ đếm ngược: tick mỗi giây; hết giờ -> tự chuyển phần
    const handleNextRef = useRef(handleNextSection);
    useEffect(() => {
        handleNextRef.current = handleNextSection;
    });

    useEffect(() => {
        if (isFinished || isSubmitting || skills.length === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const base = prev ?? (skills[activeStep]?.duration ?? 0) * 60;
                if (base <= 1) {
                    clearInterval(timer);
                    setTimeout(() => handleNextRef.current(true), 0);
                    return 0;
                }
                return base - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished, isSubmitting, skills, activeStep]);

    // Mount đồng thời mọi kỹ năng, chỉ hiển thị kỹ năng đang active bằng CSS.
    // Nếu unmount section không active thì state đáp án (useState cục bộ) sẽ mất -> nộp bài chỉ còn kỹ năng cuối.
    const renderSkillUI = () => {
        if (!examData) return null;
        const wrap = (id: SkillStep['id'], node: React.ReactNode) => (
            <div key={id} style={{ display: currentSkill?.id === id ? 'block' : 'none' }}>
                {node}
            </div>
        );
        return (
            <>
                {skills.some((s) => s.id === 'grammar') && wrap('grammar',
                    <GrammarVocabSection ref={grammarRef} data={examData.grammar} onProgressUpdate={progressHandlers.grammar} />)}
                {skills.some((s) => s.id === 'listening') && wrap('listening',
                    <ListeningSection ref={listeningRef} data={examData.listening} onProgressUpdate={progressHandlers.listening} />)}
                {skills.some((s) => s.id === 'reading') && wrap('reading',
                    <ReadingSection ref={readingRef} data={examData.reading} onProgressUpdate={progressHandlers.reading} />)}
                {skills.some((s) => s.id === 'writing') && wrap('writing',
                    <WritingSection ref={writingRef} prompts={examData.writing} onProgressUpdate={progressHandlers.writing} />)}
                {skills.some((s) => s.id === 'speaking') && wrap('speaking',
                    <SpeakingSection ref={speakingRef} data={examData.speaking} onProgressUpdate={progressHandlers.speaking} />)}
            </>
        );
    };

    if (isLoading) {
        return (
            <S.FullPageCenter>
                <Spin size="large" tip="Đang tải đề thi thử..." />
            </S.FullPageCenter>
        );
    }

    if (isError || (examData && skills.length === 0)) {
        return (
            <S.FullPageCenter>
                <div style={{ textAlign: 'center' }}>
                    <Empty description="Đề thi thử chưa có câu hỏi hoặc chưa được công khai." />
                    <Button style={{ marginTop: '1.5rem' }} onClick={() => navigate({ to: '/mock-exam' })}>
                        Quay lại danh sách
                    </Button>
                </div>
            </S.FullPageCenter>
        );
    }

    if (isFinished && submitResult) {
        return <ExamResultScreen result={submitResult} onBack={() => navigate({ to: '/mock-exam' })} />;
    }

    if (isFinished) {
        return (
            <S.FullPageCenter>
                <Result
                    status="success"
                    title="Hoàn thành toàn bộ bài thi thử!"
                    subTitle="Kết quả của bạn đang được Máy chấm và AI tổng hợp. Vui lòng kiểm tra lại sau ít phút."
                    extra={<Spin size="large" style={{ marginTop: '2rem' }} />}
                />
            </S.FullPageCenter>
        );
    }

    if (!currentSkill) {
        return (
            <S.FullPageCenter>
                <Spin size="large" />
            </S.FullPageCenter>
        );
    }

    return (
        <S.ExamLayout>
            <S.ExamHeader>
                <Space size="large">
                    <S.BackLink to="/mock-exam">
                        <LeftOutlined /> Quay lại
                    </S.BackLink>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                        {examData?.title ?? 'Đề thi thử'} — {currentSkill.title}
                    </span>
                </Space>

                <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>TIẾN ĐỘ:</span>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.75rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.9rem' }}>
                            {currentStatus.answered}/{currentSkill.totalQuestions}
                        </div>
                    </div>

                    <S.TimerWrapper style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <ClockCircleOutlined style={{ color: '#fbbf24', marginRight: '4px' }} />
                        {formatTime(displayTime)}
                    </S.TimerWrapper>
                </Space>
            </S.ExamHeader>

            <S.MainContent>
                {renderSkillUI()}
            </S.MainContent>

            <S.ExamFooter>
                <Button
                    icon={<LeftOutlined />}
                    size="large"
                    style={{ borderRadius: '2rem', fontWeight: 700, padding: '0 1.5rem', border: '1px solid #e2e8f0', color: '#64748b', background: '#f8fafc', fontSize: '0.95rem' }}
                    onClick={handlePrevSection}
                    disabled={activeStep === 0 && currentStatus.question === 1}
                >
                    Quay lại
                </Button>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.02em' }}>
                    Kỹ năng {activeStep + 1}/{skills.length}: {currentSkill.title} — Phần {currentStatus.part} trên {currentSkill.totalParts}
                </div>

                <Space size="middle">
                    <Button
                        type="primary"
                        size="large"
                        loading={isSubmitting}
                        style={{
                            borderRadius: '2rem',
                            fontWeight: 700,
                            background: activeStep === skills.length - 1 ? '#10b981' : '#3b5b8c',
                            borderColor: activeStep === skills.length - 1 ? '#10b981' : '#3b5b8c',
                            padding: '0 2rem',
                            fontSize: '0.95rem',
                            boxShadow: `0 4px 15px rgba(59, 91, 140, 0.3)`
                        }}
                        onClick={() => handleNextSection(false)}
                    >
                        {activeStep === skills.length - 1 ? 'Nộp bài' : 'Tiếp theo'}
                        <RightOutlined style={{ fontSize: '12px', marginLeft: '6px' }} />
                    </Button>
                </Space>
            </S.ExamFooter>
        </S.ExamLayout>
    );
};

export default MainMockExamPage;

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
import { Button,Modal,Result,Space,Spin,Typography } from 'antd';
import React,{ useCallback,useEffect,useRef,useState } from 'react';

// Import các module kỹ năng tích hợp
import GrammarVocabSection,{ GrammarVocabHandle } from '../components/GrammarVocabSection';
import ListeningSection,{ ListeningHandle } from '../components/ListeningSection';
import ReadingSection,{ ReadingHandle } from '../components/ReadingSection';
import SpeakingSection,{ SpeakingHandle } from '../components/SpeakingSection';
import WritingSection,{ WritingHandle } from '../components/WritingSection';

import * as S from '../styles/shared.styles';

const { Title, Text } = Typography;

const mockSkills = [
    { id: 'speaking', title: 'Nói', icon: <AudioOutlined />, duration: 12, color: '#3b82f6', totalParts: 4, totalQuestions: 12 },
    { id: 'listening', title: 'Nghe hiểu', icon: <CustomerServiceOutlined />, duration: 40, color: '#10b981', totalParts: 4, totalQuestions: 25 },
    { id: 'grammar', title: 'Ngôn ngữ', icon: <MedicineBoxOutlined />, duration: 25, color: '#f59e0b', totalParts: 2, totalQuestions: 50 },
    { id: 'reading', title: 'Đọc hiểu', icon: <ReadOutlined />, duration: 35, color: '#8b5cf6', totalParts: 4, totalQuestions: 24 },
    { id: 'writing', title: 'Viết', icon: <EditOutlined />, duration: 50, color: '#ef4444', totalParts: 4, totalQuestions: 4 },
];

const MainMockExamPage: React.FC = () => {
    const { testId } = useParams({ strict: false }) as { testId: string };
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(mockSkills[0].duration * 60);
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Specific Progress from skill
    const [currentStatus, setCurrentStatus] = useState({ part: 1, question: 1, answered: 0 });
    const [nextButtonLabel, setNextButtonLabel] = useState('Phần tiếp theo');

    // Refs for sub-navigation
    const grammarRef = useRef<GrammarVocabHandle>(null);
    const listeningRef = useRef<ListeningHandle>(null);
    const readingRef = useRef<ReadingHandle>(null);
    const writingRef = useRef<WritingHandle>(null);
    const speakingRef = useRef<SpeakingHandle>(null);

    const currentSkill = mockSkills[activeStep];

    useEffect(() => {
        if (isFinished || isSubmitting) return;

        if (timeLeft <= 0) {
            handleNextSection(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isFinished, isSubmitting]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNextSection = (isAuto = false) => {
        // Custom logic for sub-navigation (internal next question)
        if (!isAuto) {
            const skillRefMap: Record<string, any> = {
                'grammar': grammarRef,
                'listening': listeningRef,
                'reading': readingRef,
                'writing': writingRef,
                'speaking': speakingRef
            };

            const currentSkillRef = skillRefMap[currentSkill.id];
            if (currentSkillRef && currentSkillRef.current) {
                const handledInternally = currentSkillRef.current.next();
                if (handledInternally) return;
            }
        }

        const proceed = () => {
            if (activeStep < mockSkills.length - 1) {
                const nextStep = activeStep + 1;
                setActiveStep(nextStep);
                setTimeLeft(mockSkills[nextStep].duration * 60);
                setCurrentStatus({ part: 1, question: 1, answered: 0 });
                setNextButtonLabel('Phần tiếp theo');
                window.scrollTo(0, 0);
            } else {
                handleSubmitFinal();
            }
        };

        if (isAuto) {
            proceed();
            return;
        }

        Modal.confirm({
            title: 'Chuyển sang phần thi tiếp theo?',
            content: `Bạn sẽ chuyển sang phần thi ${mockSkills[activeStep + 1]?.title || 'Kết thúc'}. Bài làm của phần hiện tại sẽ được tự động lưu.`,
            okText: 'Xác nhận chuyển',
            cancelText: 'Làm tiếp',
            onOk: proceed
        });
    };

    const handlePrevSection = () => {
        // Custom logic for sub-navigation (internal prev question)
        const skillRefMap: Record<string, any> = {
            'grammar': grammarRef,
            'listening': listeningRef,
            'reading': readingRef,
            'writing': writingRef,
            'speaking': speakingRef
        };

        const currentSkillRef = skillRefMap[currentSkill.id];
        if (currentSkillRef && currentSkillRef.current) {
            const handledInternally = currentSkillRef.current.prev();
            if (handledInternally) return;
        }

        if (activeStep > 0) {
            const prevStep = activeStep - 1;
            setActiveStep(prevStep);
            setTimeLeft(mockSkills[prevStep].duration * 60);
            setCurrentStatus({ part: 1, question: 1, answered: 0 }); // Placeholder
            window.scrollTo(0, 0);
        }
    };

    const handleSubmitFinal = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsFinished(true);
            setTimeout(() => navigate({ to: '/mock-exam' }), 3000);
        }, 2500);
    };

    const onProgressUpdate = useCallback((answeredCount: number, part: number, question: number) => {
        setCurrentStatus({ part, question, answered: answeredCount });
    }, []);

    const onButtonLabelUpdate = useCallback((label: string) => {
        setNextButtonLabel(label);
    }, []);

    const renderSkillUI = () => {
        const skillId = mockSkills[activeStep].id;
        switch (skillId) {
            case 'grammar': return <GrammarVocabSection ref={grammarRef} onProgressUpdate={onProgressUpdate} />;
            case 'listening': return <ListeningSection ref={listeningRef} onProgressUpdate={onProgressUpdate} onButtonLabelUpdate={onButtonLabelUpdate} />;
            case 'reading': return <ReadingSection ref={readingRef} onProgressUpdate={onProgressUpdate} />;
            case 'writing': return <WritingSection ref={writingRef} onProgressUpdate={onProgressUpdate} />;
            case 'speaking': return <SpeakingSection ref={speakingRef} onProgressUpdate={onProgressUpdate} />;
            default: return null;
        }
    };

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

    return (
        <S.ExamLayout>
            <S.ExamHeader>
                <Space size="large">
                    <S.BackLink to="/mock-exam">
                        <LeftOutlined /> Quay lại
                    </S.BackLink>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                        Đề {currentSkill.title} số 1
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
                        {formatTime(timeLeft)}
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
                    {currentStatus.question === 1 ? 'Phần trước' : 'Câu trước'}
                </Button>

                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.02em' }}>
                    Phần {currentStatus.part} trên {currentSkill.totalParts} (Câu {currentStatus.question} / {currentSkill.totalQuestions})
                </div>

                <Space size="middle">
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            borderRadius: '2rem',
                            fontWeight: 700,
                            background: (activeStep === mockSkills.length - 1 && currentStatus.question === currentSkill.totalQuestions) ? '#10b981' : '#2563eb',
                            borderColor: (activeStep === mockSkills.length - 1 && currentStatus.question === currentSkill.totalQuestions) ? '#10b981' : '#2563eb',
                            padding: '0 2rem',
                            fontSize: '0.95rem',
                            boxShadow: `0 4px 15px rgba(37, 99, 235, 0.3)`
                        }}
                        onClick={() => {
                            if (activeStep === mockSkills.length - 1 && currentStatus.question === currentSkill.totalQuestions) {
                                handleSubmitFinal();
                            } else {
                                handleNextSection(false);
                            }
                        }}
                    >
                        {currentStatus.question === currentSkill.totalQuestions
                            ? (activeStep === mockSkills.length - 1 ? 'Nộp bài thi' : 'Phần tiếp theo')
                            : 'Câu tiếp theo'}
                        <RightOutlined style={{ fontSize: '12px', marginLeft: '6px' }} />
                    </Button>
                </Space>
            </S.ExamFooter>
        </S.ExamLayout>
    );
};

export default MainMockExamPage;

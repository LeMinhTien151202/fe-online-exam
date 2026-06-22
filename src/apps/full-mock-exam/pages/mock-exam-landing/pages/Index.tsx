import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DashboardLayout } from '../../../../home/components/DashboardLayout';
import * as S from '../styles/styled';

const mockExams = [
    { id: 'M01', title: 'Aptis Mock Test 01', questions: 125, duration: 162, difficulty: 'Medium', score: 88, status: 'completed' },
    { id: 'M02', title: 'Aptis Mock Test 02', questions: 125, duration: 162, difficulty: 'Hard', score: 72, status: 'completed' },
    { id: 'M03', title: 'Aptis Mock Test 03', questions: 125, duration: 162, difficulty: 'Medium', score: 0, status: 'new' },
    { id: 'M04', title: 'Aptis Mock Test 04', questions: 125, duration: 162, difficulty: 'Expert', score: 0, status: 'new' },
];

const skillScores = [
    { label: 'Ngữ pháp', score: 22, max: 25 },
    { label: 'Nghe', score: 19, max: 25 },
    { label: 'Đọc', score: 20, max: 25 },
    { label: 'Viết', score: 15, max: 25 },
    { label: 'Nói', score: 17, max: 25 },
];

const history = [
    { date: '15/06', name: 'Test 01', cefr: 'C', score: 82 },
    { date: '10/06', name: 'Test 01', cefr: 'B2', score: 75 },
    { date: '02/06', name: 'Test 02', cefr: 'B2', score: 72 },
];

const MockExamLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const handleStartExam = (id: string) => {
        navigate({ to: `/mock-exam/main/${id}` });
    };

    return (
        <DashboardLayout>
            <S.Container>
                {/* Modern Enterprise Hero Banner */}
                <S.HeroBanner>
                    <div className="banner-left">
                        <h1>Mock Exam Center</h1>
                        <p>Hệ thống mô phỏng kỳ thi Aptis chuẩn Enterprise</p>
                    </div>

                    <div className="banner-right">
                        <div className="stat-row">
                            <div className="stat-item">
                                <span className="val">78.5</span>
                                <span className="label">Điểm Trung Bình</span>
                            </div>
                            <div className="stat-item">
                                <span className="val" style={{ color: 'rgba(255,255,255,0.4)' }}>B2</span>
                                <span className="label">Trình độ hiện tại</span>
                            </div>
                        </div>

                        <S.TargetProgressWidget>
                            <div className="progress-info">
                                <span>Tiến độ mục tiêu</span>
                                <span className="target">Mục tiêu C · 90</span>
                            </div>
                            <div className="progress-rail">
                                <div className="progress-fill" style={{ width: '82%' }}></div>
                            </div>
                        </S.TargetProgressWidget>
                    </div>
                </S.HeroBanner>

                <S.MainGrid>
                    {/* Left Column - Test List */}
                    <S.TestListSection>
                        <div className="tabs-nav">
                            <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>Tất cả</button>
                            <button className={activeTab === 'new' ? 'active' : ''} onClick={() => setActiveTab('new')}>Chưa thi</button>
                            <button className={activeTab === 'taken' ? 'active' : ''} onClick={() => setActiveTab('taken')}>Đã thi</button>
                        </div>

                        {mockExams.map((exam, idx) => (
                            <S.TestCard key={exam.id}>
                                <div className="index">{String(idx + 1).padStart(2, '0')}</div>
                                <div className="info">
                                    <div className="top">
                                        <h3>{exam.title}</h3>
                                        <div className="difficulty">{exam.difficulty}</div>
                                        {exam.status === 'completed' && <div className="status-tag">Đã thi</div>}
                                    </div>
                                    <div className="meta">{exam.questions} câu · {exam.duration} phút</div>
                                </div>
                                <div className="score-display">
                                    {exam.score > 0 ? (
                                        <div className="big">{exam.score}<span>/100</span></div>
                                    ) : (
                                        <div className="big">--<span>/100</span></div>
                                    )}
                                </div>
                                <S.ActionButton
                                    className={exam.status === 'new' ? 'primary' : 'ghost'}
                                    onClick={() => handleStartExam(exam.id)}
                                >
                                    {exam.status === 'new' ? 'Bắt đầu' : 'Thi lại'}
                                </S.ActionButton>
                            </S.TestCard>
                        ))}
                    </S.TestListSection>

                    {/* Right Column - Skill & History */}
                    <div>
                        <S.SidebarCard>
                            <h4>Điểm từng kỹ năng</h4>
                            {skillScores.map(skill => (
                                <S.SkillBarRow key={skill.label}>
                                    <div className="label">{skill.label}</div>
                                    <div className="bar-container">
                                        <div
                                            className="fill"
                                            style={{ width: `${(skill.score / skill.max) * 100}%` }}
                                        />
                                    </div>
                                    <div className="score">{skill.score}</div>
                                </S.SkillBarRow>
                            ))}
                        </S.SidebarCard>

                        <S.SidebarCard>
                            <h4>Lịch sử thi</h4>
                            <S.HistoryList>
                                {history.map((h, i) => (
                                    <div className="history-item" key={i}>
                                        <div className="left">
                                            <span className="date">{h.date}</span>
                                            <span className="name">{h.name}</span>
                                        </div>
                                        <div className="right">
                                            <span className="cefr">{h.cefr}</span>
                                            <span className="score">{h.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </S.HistoryList>
                        </S.SidebarCard>
                    </div>
                </S.MainGrid>
            </S.Container>
        </DashboardLayout>
    );
};

export default MockExamLandingPage;

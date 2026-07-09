import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Empty, Spin } from 'antd';
import { DashboardLayout } from '../../../../home/components/DashboardLayout';
import { useMockExamSetsQuery } from '../../../services/mockExamQuery';
import * as S from '../styles/styled';

const history = [
    { date: '15/06', name: 'Test 01', cefr: 'C', score: 165 },
    { date: '10/06', name: 'Test 01', cefr: 'B2', score: 143 },
    { date: '02/06', name: 'Test 02', cefr: 'B2', score: 140 },
];

const MockExamLandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const { data: examRes, isLoading } = useMockExamSetsQuery();
    const mockExams = useMemo(() => examRes?.data ?? [], [examRes]);

    const handleStartExam = (id: number) => {
        navigate({ to: '/mock-exam/main/$testId', params: { testId: String(id) } });
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
                                <span className="val">152.0</span>
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
                                <span className="target">Mục tiêu C · 180</span>
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

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><Spin size="large" /></div>
                        ) : mockExams.length === 0 ? (
                            <div style={{ padding: '2rem' }}>
                                <Empty description="Chưa có đề thi thử nào được công khai." />
                            </div>
                        ) : (
                            mockExams.map((exam, idx) => (
                                <S.TestCard key={exam.id}>
                                    <div className="index">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="info">
                                        <div className="top">
                                            <h3>{exam.title}</h3>
                                        </div>
                                        <div className="meta">
                                            {exam._count?.sections ?? 0} kỹ năng{exam.description ? ` · ${exam.description}` : ''}
                                        </div>
                                    </div>
                                    <div className="score-display">
                                        <div className="big">--<span>/200</span></div>
                                    </div>
                                    <S.ActionButton
                                        className="primary"
                                        onClick={() => handleStartExam(exam.id)}
                                    >
                                        Bắt đầu
                                    </S.ActionButton>
                                </S.TestCard>
                            ))
                        )}
                    </S.TestListSection>

                    {/* Right Column - Skill & History */}
                    <div>


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

import React, { useMemo, useState } from 'react';
import { Empty, Pagination, Spin } from 'antd';
import { DashboardLayout } from '../../../../home/components/DashboardLayout';
import { useMockExamLanding, TARGET_SCORE, TARGET_LEVEL } from '../hook/useMockExamLanding';
import * as S from '../styles/styled';

const EMPTY_TEXT: Record<string, string> = {
    all: 'Chưa có đề thi thử nào được công khai.',
    new: 'Bạn đã thi hết các đề hiện có. 🎉',
    taken: 'Bạn chưa thi đề nào — chọn tab "Chưa thi" để bắt đầu.',
};

const HISTORY_PAGE_SIZE = 6;

const MockExamLandingPage: React.FC = () => {
    const {
        isLoading,
        activeTab,
        setActiveTab,
        filteredExams,
        takenExamIds,
        history,
        averageScore,
        cefrLevel,
        targetProgress,
        handleStartExam,
    } = useMockExamLanding();
    const [historyPage, setHistoryPage] = useState(1);
    const maxHistoryPage = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE));
    const safeHistoryPage = Math.min(historyPage, maxHistoryPage);
    const pagedHistory = useMemo(() => {
        const start = (safeHistoryPage - 1) * HISTORY_PAGE_SIZE;
        return history.slice(start, start + HISTORY_PAGE_SIZE);
    }, [history, safeHistoryPage]);

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
                                <span className="val">{averageScore != null ? Math.round(averageScore) : '--'}</span>
                                <span className="label">Điểm Trung Bình /200</span>
                            </div>
                            <div className="stat-item">
                                <span
                                    className="val"
                                    style={cefrLevel ? undefined : { color: 'rgba(255,255,255,0.4)' }}
                                >
                                    {cefrLevel ?? '--'}
                                </span>
                                <span className="label">Trình độ hiện tại</span>
                            </div>
                        </div>

                        <S.TargetProgressWidget>
                            <div className="progress-info">
                                <span>Tiến độ mục tiêu</span>
                                <span className="target">Mục tiêu {TARGET_LEVEL} · {TARGET_SCORE} điểm</span>
                            </div>
                            <div className="progress-rail">
                                <div className="progress-fill" style={{ width: `${targetProgress}%` }}></div>
                            </div>
                        </S.TargetProgressWidget>
                    </div>
                </S.HeroBanner>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
                        <Spin size="large" description="Đang tải đề thi thử..." />
                    </div>
                ) : (
                <S.MainGrid>
                    {/* Left Column - Test List */}
                    <S.TestListSection>
                        <div className="tabs-nav">
                            <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>Tất cả</button>
                            <button className={activeTab === 'new' ? 'active' : ''} onClick={() => setActiveTab('new')}>Chưa thi</button>
                            <button className={activeTab === 'taken' ? 'active' : ''} onClick={() => setActiveTab('taken')}>Đã thi</button>
                        </div>

                        {filteredExams.length === 0 ? (
                            <div style={{ padding: '2rem' }}>
                                <Empty description={EMPTY_TEXT[activeTab]} />
                            </div>
                        ) : (
                            filteredExams.map((exam, idx) => {
                                const isTaken = takenExamIds.has(exam.id);
                                return (
                                    <S.TestCard key={exam.id}>
                                        <div className="index">{String(idx + 1).padStart(2, '0')}</div>
                                        <div className="info">
                                            <div className="top">
                                                <h3>{exam.title}</h3>
                                                {isTaken && <span className="taken-tag">Đã thi</span>}
                                            </div>
                                        </div>
                                        <S.ActionButton
                                            className="primary"
                                            onClick={() => handleStartExam(exam.id)}
                                        >
                                            {isTaken ? 'Thi lại' : 'Bắt đầu'}
                                        </S.ActionButton>
                                    </S.TestCard>
                                );
                            })
                        )}
                    </S.TestListSection>

                    {/* Right Column - History */}
                    <div>
                        <S.SidebarCard>
                            <h4>Lịch sử thi</h4>
                            <S.HistoryList>
                                {history.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Chưa có lần thi nào."
                                    />
                                ) : (
                                    pagedHistory.map((item) => (
                                        <div className="history-item" key={item.id}>
                                            <span className="date">{item.date}</span>
                                            <span className="name">{item.name}</span>
                                            <div className="right">
                                                {item.cefr && <span className="cefr">{item.cefr}</span>}
                                                <span className="score">{item.score != null ? Math.round(item.score) : '--'}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </S.HistoryList>
                            {history.length > HISTORY_PAGE_SIZE && (
                                <S.HistoryPagination>
                                    <Pagination
                                        current={safeHistoryPage}
                                        pageSize={HISTORY_PAGE_SIZE}
                                        total={history.length}
                                        size="small"
                                        showSizeChanger={false}
                                        showLessItems
                                        onChange={setHistoryPage}
                                    />
                                </S.HistoryPagination>
                            )}
                        </S.SidebarCard>
                    </div>
                </S.MainGrid>
                )}
            </S.Container>
        </DashboardLayout>
    );
};

export default MockExamLandingPage;

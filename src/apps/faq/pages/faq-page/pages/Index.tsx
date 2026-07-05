import React from 'react';
import { Spin } from 'antd';
import { DashboardLayout } from '../../../../home/components/DashboardLayout';
import { useFaqList } from '../hook/useFaqList';
import * as S from '../styles/faq.styled';

const FAQPage: React.FC = () => {
    const {
        isLoading,
        categories,
        filteredFaqs,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        openId,
        toggleOpen,
    } = useFaqList();

    return (
        <DashboardLayout>
            <S.Container>
                <S.HeaderSection>
                    <h1>Góc giải đáp (Q&A)</h1>
                    <p>
                        Chào mừng bạn đến với trung tâm hỗ trợ của Aptis Test.
                        Tại đây chúng tôi đã tổng hợp những thắc mắc phổ biến nhất để giúp lộ trình ôn thi của bạn suôn sẻ hơn.
                    </p>

                    <S.SearchWrapper>
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input
                            type="text"
                            placeholder="Bạn đang vướng mắc điều gì? Nhập từ khóa tại đây..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </S.SearchWrapper>
                </S.HeaderSection>

                <S.CategoryFilter>
                    {categories.map(cat => (
                        <S.CategoryChip
                            key={cat}
                            $active={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </S.CategoryChip>
                    ))}
                </S.CategoryFilter>

                <S.FAQList>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Spin />
                        </div>
                    ) : filteredFaqs.length > 0 ? (
                        filteredFaqs.map(faq => (
                            <S.FAQItem key={faq.id} $isOpen={openId === faq.id}>
                                <S.QuestionBox onClick={() => toggleOpen(faq.id)}>
                                    <h3>{faq.question}</h3>
                                    <span className="material-symbols-outlined toggle-icon" style={{
                                        transform: openId === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                        color: openId === faq.id ? '#1a365d' : '#94a3b8'
                                    }}>
                                        expand_more
                                    </span>
                                </S.QuestionBox>
                                <S.AnswerBox $isOpen={openId === faq.id}>
                                    <p dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br/>') }} />
                                </S.AnswerBox>
                            </S.FAQItem>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem' }}>search_off</span>
                            <p>Không tìm thấy câu trả lời phù hợp với từ khóa của bạn.</p>
                        </div>
                    )}
                </S.FAQList>

                <S.ContactSection>
                    <h4>Vẫn còn thắc mắc khác?</h4>
                    <p>Đội ngũ hỗ trợ chuyên môn của chúng tôi luôn sẵn sàng giải đáp các vấn đề chuyên sâu về kỳ thi cho bạn.</p>
                    <S.PrimaryButton onClick={() => window.open('https://zalo.me', '_blank')}>
                        Liên hệ Hỗ trợ Zalo
                    </S.PrimaryButton>
                </S.ContactSection>
            </S.Container>
        </DashboardLayout>
    );
};

export default FAQPage;

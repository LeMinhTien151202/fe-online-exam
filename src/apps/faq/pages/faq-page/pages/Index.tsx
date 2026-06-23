import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../../../../home/components/DashboardLayout';
import * as S from '../styles/faq.styled';

interface FAQData {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const mockFaqs: FAQData[] = [
    {
        id: 1,
        category: 'Kỳ thi Aptis',
        question: 'Aptis ESOL là gì?',
        answer: 'Aptis ESOL là bài thi đánh giá trình độ tiếng Anh hiện đại được phát triển bởi Hội đồng Anh (British Council). Bài thi đánh giá 4 kỹ năng: Nghe, Nói, Đọc, Viết và một phần kiểm tra Từ vựng & Ngữ pháp bắt buộc.'
    },
    {
        id: 2,
        category: 'Kỳ thi Aptis',
        question: 'Bao lâu thì có kết quả thi Aptis?',
        answer: 'Thông thường, kết quả thi Aptis trực tuyến sẽ có sau 2-5 ngày làm việc. Chứng chỉ bản cứng sẽ được gửi về địa chỉ của thí sinh sau khoảng 10-15 ngày làm việc.'
    },
    {
        id: 3,
        category: 'Tài khoản',
        question: 'Làm thế nào để đổi mật khẩu?',
        answer: 'Bạn có thể vào mục "Cài đặt tài khoản" ở góc dưới bên trái (menu cá nhân), chọn "Đổi mật khẩu" và làm theo hướng dẫn của hệ thống.'
    },
    {
        id: 4,
        category: 'Luyện thi Ngữ pháp',
        question: 'Phần thi Ngữ pháp & Từ vựng có tính vào tổng điểm không?',
        answer: 'Phần thi Ngữ pháp & Từ vựng đóng vai trò là "điểm tham chiếu". Nếu điểm của bạn nằm ở ranh giới giữa 2 cấp độ (ví dụ B1 và B2), kết quả phần này sẽ quyết định bạn thuộc cấp độ nào cao hơn.'
    },
    {
        id: 5,
        category: 'Thi thử',
        question: 'Tôi có thể làm lại bài thi thử nhiều lần không?',
        answer: 'Có, bạn có thể thực hiện bài thi thử không giới hạn số lần. Hệ thống sẽ lưu lại lịch sử tất cả các lần thi để bạn theo dõi sự tiến bộ của mình.'
    },
    {
        id: 6,
        category: 'Học phí & Gói học',
        question: 'Gói Pro khác gói Miễn phí như thế nào?',
        answer: 'Gói Pro cung cấp quyền truy cập vào kho đề thi thực tế mới nhất, giải thích chi tiết đáp án, và được chấm chữa bài viết/nói bởi đội ngũ giáo viên bản ngữ.'
    }
];

const FAQPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [openId, setOpenId] = useState<number | null>(1);

    const categories = useMemo(() => {
        const cats = new Set(mockFaqs.map(f => f.category));
        return ['Tất cả', ...Array.from(cats)];
    }, []);

    const filteredFaqs = useMemo(() => {
        return mockFaqs.filter(faq => {
            const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'Tất cả' || faq.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const toggleOpen = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

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
                    {filteredFaqs.length > 0 ? (
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

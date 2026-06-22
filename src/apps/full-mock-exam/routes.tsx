import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import MockExamLandingPage from './pages/mock-exam-landing/pages/Index';
import MainMockExamPage from './pages/main-mock-exam/pages/Index';

// Route chính cho toàn bộ module Thi thử Full 5 kỹ năng
export const mockExamRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mock-exam',
    component: MockExamLandingPage,
});

// Trang thi chính (Điều phối 5 kỹ năng)
export const mainMockExamRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mock-exam/main/$testId',
    component: MainMockExamPage,
});

// Thêm các sub-routes nếu cần cho từng kỹ năng cụ thể trong tương lai
// hoặc trang kết quả (Result)

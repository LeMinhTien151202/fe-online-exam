import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import { antThemeConfig } from './configs/antDesign';
import { QueryProvider } from './shared/providers/QueryProvider';
import { store } from './shared/store/store';
import { useAuthBootstrap } from './shared/hooks/useAuthBootstrap';
import { createRouter, RouterProvider } from '@tanstack/react-router';

// Import Root Route và các Route con định nghĩa riêng tại từng module trang
import { rootRoute } from './shared/router/root';
import { homeRoutes } from './apps/home/routes';
import { materialsRoute } from './apps/materials/routes';
import { readingRoute, readingPart1Route, readingPart2Route, readingPart3Route, readingPart4Route, readingMockTestRoute } from './apps/reading-practice/routes';
import { listeningRoute, listeningPart1Route, listeningPart2Route, listeningPart3Route, listeningPart4Route, listeningMockTestRoute } from './apps/listening-practice/routes';
import { speakingRoute, speakingPart1Route, speakingPart2Route, speakingPart3Route, speakingPart4Route, speakingMockTestRoute } from './apps/speaking-practice/routes';
import { grammarRoute, grammarTestRoute, grammarPart1Route, grammarPart2Route, grammarMockTestRoute } from './apps/grammar-practice/routes';
import { writingRoute, writingPart1Route, writingPart2Route, writingPart3Route, writingPart4Route, writingMockTestRoute } from './apps/writing-practice/routes';
import { authRoutes } from './apps/auth/routes';
import { mockExamRoute, mainMockExamRoute } from './apps/full-mock-exam/routes';
import { faqRoutes } from './apps/faq/routes';
import {
  adminRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminQuestionsRoute,
  adminQuestionsBaseRoute,
  adminExamsRoute,
  adminCreateExamRoute,
  adminExamDetailRoute,
  adminMaterialsRoute,
  adminProgressRoute,
  adminGradingRoute,
  adminGradingDetailRoute,
  adminSettingsRoute,
  adminFaqRoute,
  adminNotificationsRoute,
} from './apps/admin/routes';

// 1. Xây dựng Route Tree và khởi tạo Router
const routeTree = rootRoute.addChildren([
  ...homeRoutes,
  materialsRoute,
  readingRoute,
  readingPart1Route,
  readingPart2Route,
  readingPart3Route,
  readingPart4Route,
  readingMockTestRoute,
  listeningRoute,
  listeningPart1Route,
  listeningPart2Route,
  listeningPart3Route,
  listeningPart4Route,
  listeningMockTestRoute,
  speakingRoute,
  speakingPart1Route,
  speakingPart2Route,
  speakingPart3Route,
  speakingPart4Route,
  speakingMockTestRoute,
  grammarRoute,
  grammarTestRoute,
  grammarPart1Route,
  grammarPart2Route,
  grammarMockTestRoute,
  writingRoute,
  writingPart1Route,
  writingPart2Route,
  writingPart3Route,
  writingPart4Route,
  writingMockTestRoute,
  ...authRoutes,
  mockExamRoute,
  mainMockExamRoute,
  ...faqRoutes,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminUsersRoute,
    adminQuestionsRoute,
    adminQuestionsBaseRoute,
    adminExamsRoute,
    adminCreateExamRoute,
    adminExamDetailRoute,
    adminMaterialsRoute,
    adminProgressRoute,
    adminGradingRoute,
    adminGradingDetailRoute,
    adminSettingsRoute,
    adminFaqRoute,
    adminNotificationsRoute,
  ]),
]);
const router = createRouter({ routeTree });

// Đăng ký kiểu cho router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Khôi phục phiên đăng nhập (nếu có), không chặn app khi thất bại (guest mode)
const AuthBootstrap: React.FC = () => {
  useAuthBootstrap();
  return null;
};

/**
 * Root Component của ứng dụng
 */
function App() {
  return (
    <ReduxProvider store={store}>
      <QueryProvider>
        <ConfigProvider theme={antThemeConfig}>
          <AuthBootstrap />
          <RouterProvider router={router} />
        </ConfigProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}

export default App;


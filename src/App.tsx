import React from 'react';
import { ConfigProvider } from 'antd';
import { antThemeConfig } from './configs/antDesign';
import { QueryProvider } from './shared/providers/QueryProvider';
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
import {
  adminRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminQuestionsRoute,
  adminQuestionsBaseRoute,
  adminExamsRoute,
  adminCreateExamRoute,
  adminMaterialsRoute,
  adminProgressRoute,
  adminGradingRoute,
  adminGradingDetailRoute,
  adminSettingsRoute,
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
  adminRoute.addChildren([
    adminDashboardRoute,
    adminUsersRoute,
    adminQuestionsRoute,
    adminQuestionsBaseRoute,
    adminExamsRoute,
    adminCreateExamRoute,
    adminMaterialsRoute,
    adminProgressRoute,
    adminGradingRoute,
    adminGradingDetailRoute,
    adminSettingsRoute,
  ]),
]);
const router = createRouter({ routeTree });

// Đăng ký kiểu cho router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * Root Component của ứng dụng
 */
function App() {
  return (
    <QueryProvider>
      <ConfigProvider theme={antThemeConfig}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryProvider>
  );
}

export default App;


import React from 'react';
import { ConfigProvider } from 'antd';
import { antThemeConfig } from './configs/antDesign';
import { QueryProvider } from './shared/providers/QueryProvider';
import { createRouter, RouterProvider } from '@tanstack/react-router';

// Import Root Route và các Route con định nghĩa riêng tại từng module trang
import { rootRoute } from './shared/router/root';
import { homeRoute } from './apps/home/routes';
import { readingRoute, readingPart1Route, readingPart2Route, readingPart3Route, readingPart4Route } from './apps/reading-practice/routes';
import { listeningRoute } from './apps/listening-practice/routes';
import { speakingRoute } from './apps/speaking-practice/routes';
import { grammarRoute } from './apps/grammar-practice/routes';
import { writingRoute } from './apps/writing-practice/routes';

// 1. Xây dựng Route Tree và khởi tạo Router
const routeTree = rootRoute.addChildren([
  homeRoute,
  readingRoute,
  readingPart1Route,
  readingPart2Route,
  readingPart3Route,
  readingPart4Route,
  listeningRoute,
  speakingRoute,
  grammarRoute,
  writingRoute
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


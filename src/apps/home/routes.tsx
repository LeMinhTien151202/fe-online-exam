import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import HomePage from './pages/Index';

// Định nghĩa route cho Trang chủ (Dashboard)
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

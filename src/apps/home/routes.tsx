import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import HomePage from './pages/Index';
import ProfilePage from './pages/profile/pages/ProfilePage';

// Route cho Trang chủ (Dashboard)
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Route cho Hồ sơ cá nhân
export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

export const homeRoutes = [homeRoute, profileRoute];

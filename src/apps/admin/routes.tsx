import { createRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import React from 'react';
import { rootRoute } from '../../shared/router/root';
import { RequireRole } from '@/shared/auth/RequireRole';
import { ROLE_ACCESS, UserRole } from '@/shared/auth/roleAccess';

const AdminLayoutPage = lazyRouteComponent(() => import('./components/AdminLayout'));
const AdminDashboardPage = lazyRouteComponent(() => import('./pages/admin-dashboard/pages/Index'));
const AdminUsersPage = lazyRouteComponent(() => import('./pages/admin-users/pages/Index'));
const AdminQuestionsPage = lazyRouteComponent(() => import('./pages/admin-questions/pages/Index'));
const AdminExamsPage = lazyRouteComponent(() => import('./pages/admin-exams/pages/Index'));
const AdminCreateExamPage = lazyRouteComponent(() => import('./pages/admin-exams/pages/CreateExam'));
const AdminExamDetailPage = lazyRouteComponent(() => import('./pages/admin-exams/pages/ExamDetail'));
const AdminMaterialsPage = lazyRouteComponent(() => import('./pages/admin-materials/pages/Index'));
const AdminGradingPage = lazyRouteComponent(() => import('./pages/admin-grading/pages/Index'));
const AdminSettingsPage = lazyRouteComponent(() => import('./pages/admin-settings/pages/Index'));
const AdminFaqPage = lazyRouteComponent(() => import('./pages/admin-faq/pages/Index'));
const AdminNotificationsPage = lazyRouteComponent(() => import('./pages/admin-notifications/pages/Index'));

// Bọc component trong guard vai trò. Toàn khu /admin dành cho ADMIN + TEACHER;
// một số trang chỉ ADMIN sẽ được bọc thêm bằng adminOnly.
const guard = (Component: React.ComponentType, allow: UserRole[]): React.FC => {
  const Guarded: React.FC = () => (
    <RequireRole allow={allow}>
      <Component />
    </RequireRole>
  );
  return Guarded;
};

// 1. Layout Route — chặn STUDENT / khách ngay từ khung quản trị.
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: guard(AdminLayoutPage, ROLE_ACCESS.contentManagers),
});

export const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: guard(AdminDashboardPage, ROLE_ACCESS.contentManagers),
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: guard(AdminUsersPage, ROLE_ACCESS.adminOnly),
});

export const adminQuestionsBaseRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/questions',
  beforeLoad: () => {
    throw redirect({ to: '/admin/questions/$skillId', params: { skillId: 'grammar' } });
  },
});

export const adminQuestionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/questions/$skillId',
  component: AdminQuestionsPage,
});

export const adminExamsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/exams',
  component: AdminExamsPage,
});

export const adminCreateExamRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/exams/create',
  component: AdminCreateExamPage,
});

export const adminExamDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/exams/$examId',
  component: AdminExamDetailPage,
});

export const adminMaterialsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/materials',
  component: AdminMaterialsPage,
});

export const adminGradingRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/grading',
  component: AdminGradingPage,
});

export const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: guard(AdminSettingsPage, ROLE_ACCESS.adminOnly),
});

export const adminFaqRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/faq',
  component: AdminFaqPage,
});

export const adminNotificationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/notifications',
  component: guard(AdminNotificationsPage, ROLE_ACCESS.contentManagers),
});

// Helper collection of all child routes to add to routeTree in App.tsx
export const adminRoutes = [
  adminRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminQuestionsRoute,
  adminQuestionsBaseRoute,
  adminExamsRoute,
  adminCreateExamRoute,
  adminExamDetailRoute,
  adminMaterialsRoute,
  adminGradingRoute,
  adminSettingsRoute,
  adminFaqRoute,
  adminNotificationsRoute,
];
export const adminRouteChildren = [
  adminDashboardRoute,
  adminUsersRoute,
  adminQuestionsRoute,
  adminQuestionsBaseRoute,
  adminExamsRoute,
  adminCreateExamRoute,
  adminExamDetailRoute,
  adminMaterialsRoute,
  adminGradingRoute,
  adminSettingsRoute,
  adminFaqRoute,
  adminNotificationsRoute,
];

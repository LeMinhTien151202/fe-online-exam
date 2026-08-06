import { createRoute } from '@tanstack/react-router';
import React from 'react';
import { rootRoute } from '../../shared/router/root';
import AdminLayoutPage from './components/AdminLayout';
import { RequireRole } from '@/shared/auth/RequireRole';
import { ROLE_ACCESS, UserRole } from '@/shared/auth/roleAccess';

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

// 2. Child pages lazy components or direct imports
import AdminDashboardPage from './pages/admin-dashboard/pages/Index';
import AdminUsersPage from './pages/admin-users/pages/Index';
import AdminQuestionsPage from './pages/admin-questions/pages/Index';
import AdminExamsPage from './pages/admin-exams/pages/Index';
import AdminCreateExamPage from './pages/admin-exams/pages/CreateExam';
import AdminExamDetailPage from './pages/admin-exams/pages/ExamDetail';
import AdminMaterialsPage from './pages/admin-materials/pages/Index';
import AdminProgressPage from './pages/admin-progress/pages/Index';
import AdminGradingPage from './pages/admin-grading/pages/Index';
import AdminGradingDetailPage from './pages/admin-grading/pages/Detail';
import AdminSettingsPage from './pages/admin-settings/pages/Index';
import AdminFaqPage from './pages/admin-faq/pages/Index';
import AdminNotificationsPage from './pages/admin-notifications/pages/Index';

export const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: guard(AdminDashboardPage, ROLE_ACCESS.adminOnly),
});

export const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: guard(AdminUsersPage, ROLE_ACCESS.adminOnly),
});

import { redirect } from '@tanstack/react-router';

export const adminQuestionsBaseRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/questions',
  beforeLoad: () => {
    throw redirect({ to: '/admin/questions/grammar' as any });
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

export const adminProgressRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/progress',
  component: AdminProgressPage,
});

export const adminGradingRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/grading',
  component: AdminGradingPage,
});

export const adminGradingDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/grading/$resultId',
  component: AdminGradingDetailPage,
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
  component: guard(AdminNotificationsPage, ROLE_ACCESS.adminOnly),
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
  adminProgressRoute,
  adminGradingRoute,
  adminGradingDetailRoute,
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
  adminProgressRoute,
  adminGradingRoute,
  adminGradingDetailRoute,
  adminSettingsRoute,
  adminFaqRoute,
  adminNotificationsRoute,
];

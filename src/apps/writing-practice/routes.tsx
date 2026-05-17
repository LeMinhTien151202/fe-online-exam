import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import WritingPracticePage from './pages/Index';

// Định nghĩa route cho Trang luyện tập Viết
export const writingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing',
  component: WritingPracticePage,
});

import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import GrammarPracticePage from './pages/Index';

// Định nghĩa route cho Trang luyện tập Ngữ pháp & Từ vựng
export const grammarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar',
  component: GrammarPracticePage,
});

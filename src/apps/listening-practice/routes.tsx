import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import ListeningPracticePage from './pages/Index';

// Định nghĩa route cho Trang luyện tập Nghe
export const listeningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening',
  component: ListeningPracticePage,
});

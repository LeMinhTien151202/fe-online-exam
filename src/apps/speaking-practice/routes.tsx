import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import SpeakingPracticePage from './pages/Index';

// Định nghĩa route cho Trang luyện tập Nói
export const speakingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking',
  component: SpeakingPracticePage,
});

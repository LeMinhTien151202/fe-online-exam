import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import GrammarPracticePage from './pages/grammar-landing/pages/Index';
import { GrammarTestPage } from './pages/grammar-test/pages/Index';


// Định nghĩa route cho Trang luyện tập Ngữ pháp & Từ vựng
export const grammarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar',
  component: GrammarPracticePage,
});

// Định nghĩa route cho Trang làm bài thi thử chính
export const grammarTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/test',
  component: GrammarTestPage,
});

// Định nghĩa route cho Trang luyện tập theo phần
export const grammarPartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/part/$partId',
  component: GrammarTestPage,
});

// Định nghĩa route cho Trang làm bài thi thử theo bộ đề
export const grammarMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/mock-test/$testId',
  component: GrammarTestPage,
});



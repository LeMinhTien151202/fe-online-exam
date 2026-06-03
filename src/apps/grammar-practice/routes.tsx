import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import GrammarPracticePage from './pages/grammar-landing/pages/Index';
import Part1Page from './pages/grammar-part1/pages/Index';
import Part2Page from './pages/grammar-part2/pages/Index';
import GrammarMockTestPage from './pages/grammar-mock-test/pages/Index';


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
  component: GrammarMockTestPage,
});

// Định nghĩa route cho Trang luyện tập theo phần 1
export const grammarPart1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/part/1',
  component: Part1Page,
});

// Định nghĩa route cho Trang luyện tập theo phần 2
export const grammarPart2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/part/2',
  component: Part2Page,
});

// Định nghĩa route cho Trang làm bài thi thử theo bộ đề
export const grammarMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/grammar/mock-test/$testId',
  component: GrammarMockTestPage,
});



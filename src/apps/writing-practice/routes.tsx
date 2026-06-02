import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import WritingPracticePage from './pages/writing-landing/pages/Index';
import Part1Page from './pages/writing-part1/pages/Index';
import Part2Page from './pages/writing-part2/pages/Index';
import Part3Page from './pages/writing-part3/pages/Index';
import Part4Page from './pages/writing-part4/pages/Index';
import { WritingMockTestPage } from './pages/writing-mock-test/pages/Index';

// Định nghĩa route cho Trang luyện tập Viết
export const writingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing',
  component: WritingPracticePage,
});

export const writingPart1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/part/1',
  component: Part1Page,
});

export const writingPart2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/part/2',
  component: Part2Page,
});

export const writingPart3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/part/3',
  component: Part3Page,
});

export const writingPart4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/part/4',
  component: Part4Page,
});

export const writingMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/mock-test/$testId',
  component: WritingMockTestPage,
});

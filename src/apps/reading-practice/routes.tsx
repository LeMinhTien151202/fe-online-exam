import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import ReadingPracticePage from './pages/reading-landing/pages/Index';
import Part1Page from './pages/reading-part1/pages/Index';
import Part2Page from './pages/reading-part2/pages/Index';
import Part3Page from './pages/reading-part3/pages/Index';
import Part4Page from './pages/reading-part4/pages/Index';
import ReadingMockTestPage from './pages/reading-mock-test/pages/Index';

// Định nghĩa route cho Trang luyện tập Đọc hiểu
export const readingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading',
  component: ReadingPracticePage,
});

export const readingPart1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading/part/1',
  component: Part1Page,
});

export const readingPart2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading/part/2',
  component: Part2Page,
});

export const readingPart3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading/part/3',
  component: Part3Page,
});

export const readingPart4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading/part/4',
  component: Part4Page,
});

export const readingMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reading/mock-test/$testId',
  component: ReadingMockTestPage,
});


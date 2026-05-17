import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import ReadingPracticePage from './pages/Index';
import Part1Page from './pages/parts/part1/Index';
import Part2Page from './pages/parts/part2/Index';
import Part3Page from './pages/parts/part3/Index';
import Part4Page from './pages/parts/part4/Index';

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

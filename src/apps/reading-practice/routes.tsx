import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';

const ReadingPracticePage = lazyRouteComponent(() => import('./pages/reading-landing/pages/Index'));
const Part1Page = lazyRouteComponent(() => import('./pages/reading-part1/pages/Index'));
const Part2Page = lazyRouteComponent(() => import('./pages/reading-part2/pages/Index'));
const Part3Page = lazyRouteComponent(() => import('./pages/reading-part3/pages/Index'));
const Part4Page = lazyRouteComponent(() => import('./pages/reading-part4/pages/Index'));
const ReadingMockTestPage = lazyRouteComponent(() => import('./pages/reading-mock-test/pages/Index'));

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

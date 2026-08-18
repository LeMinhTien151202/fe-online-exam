import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';

const WritingPracticePage = lazyRouteComponent(() => import('./pages/writing-landing/pages/Index'));
const Part1Page = lazyRouteComponent(() => import('./pages/writing-part1/pages/Index'));
const Part2Page = lazyRouteComponent(() => import('./pages/writing-part2/pages/Index'));
const Part3Page = lazyRouteComponent(() => import('./pages/writing-part3/pages/Index'));
const Part4Page = lazyRouteComponent(() => import('./pages/writing-part4/pages/Index'));
const WritingMockTestPage = lazyRouteComponent(
  () => import('./pages/writing-mock-test/pages/Index'),
  'WritingMockTestPage',
);

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

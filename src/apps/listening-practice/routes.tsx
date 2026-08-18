import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';

const ListeningPracticePage = lazyRouteComponent(() => import('./pages/listening-landing/pages/Index'));
const Part1Page = lazyRouteComponent(() => import('./pages/listening-part1/pages/Index'));
const Part2Page = lazyRouteComponent(() => import('./pages/listening-part2/pages/Index'));
const Part3Page = lazyRouteComponent(() => import('./pages/listening-part3/pages/Index'));
const Part4Page = lazyRouteComponent(() => import('./pages/listening-part4/pages/Index'));
const ListeningMockTestPage = lazyRouteComponent(
  () => import('./pages/listening-mock-test/pages/Index'),
  'ListeningMockTestPage',
);

// Định nghĩa route cho Trang luyện tập Nghe
export const listeningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening',
  component: ListeningPracticePage,
});

export const listeningPart1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening/part/1',
  component: Part1Page,
});

export const listeningPart2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening/part/2',
  component: Part2Page,
});

export const listeningPart3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening/part/3',
  component: Part3Page,
});

export const listeningPart4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening/part/4',
  component: Part4Page,
});

export const listeningMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listening/mock-test/$testId',
  component: ListeningMockTestPage,
});

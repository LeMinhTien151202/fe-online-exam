import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';

const SpeakingPracticePage = lazyRouteComponent(() => import('./pages/speaking-landing/pages/Index'));
const Part1Page = lazyRouteComponent(() => import('./pages/speaking-part1/pages/Index'));
const Part2Page = lazyRouteComponent(() => import('./pages/speaking-part2/pages/Index'));
const Part3Page = lazyRouteComponent(() => import('./pages/speaking-part3/pages/Index'));
const Part4Page = lazyRouteComponent(() => import('./pages/speaking-part4/pages/Index'));
const SpeakingMockTestPage = lazyRouteComponent(
  () => import('./pages/speaking-mock-test/pages/Index'),
  'SpeakingMockTestPage',
);

// Định nghĩa route cho Trang luyện tập Nói
export const speakingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking',
  component: SpeakingPracticePage,
});

export const speakingPart1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking/part/1',
  component: Part1Page,
});

export const speakingPart2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking/part/2',
  component: Part2Page,
});

export const speakingPart3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking/part/3',
  component: Part3Page,
});

export const speakingPart4Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking/part/4',
  component: Part4Page,
});

export const speakingMockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speaking/mock-test/$testId',
  component: SpeakingMockTestPage,
});

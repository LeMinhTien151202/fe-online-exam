import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import SpeakingPracticePage from './pages/speaking-landing/pages/Index';
import Part1Page from './pages/speaking-part1/pages/Index';
import Part2Page from './pages/speaking-part2/pages/Index';
import Part3Page from './pages/speaking-part3/pages/Index';
import Part4Page from './pages/speaking-part4/pages/Index';
import { SpeakingMockTestPage } from './pages/speaking-mock-test/pages/Index';

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

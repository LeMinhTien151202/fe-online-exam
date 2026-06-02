import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import ListeningPracticePage from './pages/listening-landing/pages/Index';
import Part1Page from './pages/listening-part1/pages/Index';
import Part2Page from './pages/listening-part2/pages/Index';
import Part3Page from './pages/listening-part3/pages/Index';
import Part4Page from './pages/listening-part4/pages/Index';
import { ListeningMockTestPage } from './pages/listening-mock-test/pages/Index';

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


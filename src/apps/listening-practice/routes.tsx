import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import ListeningPracticePage from './pages/Index';
import Part1Page from './pages/parts/part1/Index';
import Part2Page from './pages/parts/part2/Index';
import Part3Page from './pages/parts/part3/Index';
import Part4Page from './pages/parts/part4/Index';

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

import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import MaterialsPage from './pages/Index';

export const materialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/materials',
  component: MaterialsPage,
});

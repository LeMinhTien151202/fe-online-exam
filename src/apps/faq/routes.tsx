import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../shared/router/root';
import FAQPage from './pages/faq-page/pages/Index';

export const faqRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/faq',
    component: FAQPage,
});

export const faqRoutes = [faqRoute];
